import { Copy,styles } from "@/components/ui";
import { animation,colors as c } from "@/constants/theme";
import { PerformanceResult } from "@/types";
import { timeText } from "@/utils/performance";
import React,{ useEffect } from "react";
import { View,useWindowDimensions } from "react-native";
import Animated,{
FadeIn,
useAnimatedProps,
useSharedValue,
withSpring,
withTiming,
} from "react-native-reanimated";
import Svg,{ Circle,Line,Path,Text as SvgText } from "react-native-svg";
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export function GoalVisualization({
  current,
  pb,
  target,
  baseline,
}: {
  current: number;
  pb: number;
  target: number;
  baseline: number;
}) {
  const width = Math.min(useWindowDimensions().width - 96, 536);
  const low = Math.min(target, pb, current),
    high = Math.max(baseline, current, low + 0.1);
  const x = (v: number) => 16 + ((high - v) / (high - low)) * (width - 32);
  const currentPosition = useSharedValue(x(baseline));
  const destination = x(current);
  useEffect(() => {
    currentPosition.value = withSpring(destination, animation.spring);
  }, [destination, currentPosition]);
  const marker = useAnimatedProps(() => ({ cx: currentPosition.value }));
  return (
    <View
      accessibilityLabel={`Current ${timeText(current)}, personal best ${timeText(pb)}, goal ${timeText(target)}`}
    >
      <Svg width={width} height={92}>
        <Line
          x1={16}
          x2={width - 16}
          y1={35}
          y2={35}
          stroke={c.border}
          strokeWidth={3}
        />
        {[
          { v: current, label: "CURRENT", color: c.accentPrimary, y: 18 },
          { v: pb, label: "PB", color: c.textSecondary, y: 70 },
          { v: target, label: "GOAL", color: c.accentSecondary, y: 18 },
        ].map((m) => (
          <React.Fragment key={m.label}>
            {m.label === "CURRENT" ? (
              <AnimatedCircle
                animatedProps={marker}
                cy={35}
                r={5}
                fill={m.color}
              />
            ) : (
              <Circle cx={x(m.v)} cy={35} r={5} fill={m.color} />
            )}
            <SvgText
              x={x(m.v)}
              y={m.y}
              fill={m.color}
              fontSize={10}
              textAnchor={
                m.v === target ? "end" : m.v === current ? "start" : "middle"
              }
            >
              {m.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
      <View style={styles.row}>
        <Copy muted>{timeText(current)} current</Copy>
        <Copy color={c.accentSecondary}>{timeText(target)} goal</Copy>
      </View>
    </View>
  );
}
export function PerformanceChart({
  results,
  goal,
  pb,
}: {
  results: PerformanceResult[];
  goal?: number;
  pb?: number;
}) {
  const width = Math.min(useWindowDimensions().width - 48, 632),
    height = 210;
  const ordered = [...results].sort((a, b) => a.date.localeCompare(b.date));

  const values = [
    ...ordered.map((p) => p.time),
    ...(goal ? [goal] : []),
    ...(pb ? [pb] : []),
  ];
  const min = (values.length ? Math.min(...values) : 0) - 0.15,
    max = (values.length ? Math.max(...values) : 1) + 0.15;
  const y = (v: number) => 16 + ((v - min) / (max - min)) * (height - 48);
  const x = (i: number) =>
    38 + (i * (width - 52)) / Math.max(1, ordered.length - 1);
  const d = ordered
    .map((p, i) => `${i ? "L" : "M"} ${x(i)} ${y(p.time)}`)
    .join(" ");
  const length = ordered.reduce((sum, p, i) => {
    const previous = ordered[i - 1];
    return previous
      ? sum + Math.hypot(x(i) - x(i - 1), y(p.time) - y(previous.time))
      : sum;
  }, 0);
  const draw = useSharedValue(0);
  useEffect(() => {
    draw.value = 0;
    draw.value = withTiming(1, { duration: animation.chartDuration });
  }, [d, draw]);
  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: (1 - draw.value) * length,
  }));
  if (!ordered.length) return <Copy muted>No performances in this range.</Copy>;
  return (
    <Animated.View
      entering={FadeIn.duration(animation.duration)}
      accessibilityLabel={`Performance trend: ${ordered.map((p) => timeText(p.time)).join(", ")}. Lower times are faster.`}
    >
      <Svg width={width} height={height}>
        {[min, (min + max) / 2, max].map((v) => (
          <React.Fragment key={v}>
            <Line
              x1={38}
              x2={width - 14}
              y1={y(v)}
              y2={y(v)}
              stroke={c.border}
            />
            <SvgText x={0} y={y(v) + 4} fill={c.textSecondary} fontSize={10}>
              {v.toFixed(1)}
            </SvgText>
          </React.Fragment>
        ))}
        {[
          { value: goal, label: "GOAL", color: c.accentSecondary },
          { value: pb, label: "PB", color: c.warning },
        ].map(
          (m) =>
            m.value !== undefined && (
              <React.Fragment key={m.label}>
                <Line
                  x1={38}
                  x2={width - 14}
                  y1={y(m.value)}
                  y2={y(m.value)}
                  stroke={m.color}
                  strokeDasharray="4 5"
                />
                <SvgText
                  x={width - 16}
                  y={y(m.value) - 5}
                  textAnchor="end"
                  fill={m.color}
                  fontSize={10}
                >
                  {m.label}
                </SvgText>
              </React.Fragment>
            ),
        )}
        <AnimatedPath
          d={d}
          animatedProps={lineProps}
          strokeDasharray={`${length} ${length}`}
          stroke={c.accentPrimary}
          strokeWidth={2.5}
          fill="none"
        />
        {ordered.map((p, i) => (
          <Circle
            key={p.id}
            cx={x(i)}
            cy={y(p.time)}
            r={4}
            fill={c.accentPrimary}
          />
        ))}
        <SvgText x={38} y={height - 4} fill={c.textSecondary} fontSize={10}>
          {ordered[0]?.date.slice(5)}
        </SvgText>
        <SvgText
          x={width - 14}
          y={height - 4}
          textAnchor="end"
          fill={c.textSecondary}
          fontSize={10}
        >
          {ordered.at(-1)?.date.slice(5)}
        </SvgText>
      </Svg>
      <Copy kind="meta" muted>
        LOWER IS FASTER · SECONDS
      </Copy>
    </Animated.View>
  );
}
