import { AppCard,Avatar,Copy,StatusBadge,styles } from "@/components/ui";
import { events } from "@/data/mockData";
import { Swimmer } from "@/types";
import { eventName } from "@/utils/performance";
import { View } from "react-native";
export function AthleteRow({
  athlete,
  onPress,
}: {
  athlete: Swimmer;
  onPress: () => void;
}) {
  return (
    <AppCard onPress={onPress} label={`Review ${athlete.name}`}>
      <View style={styles.row}>
        <Avatar name={athlete.name} />
        <View style={{ flex: 1, gap: 4 }}>
          <Copy kind="section">{athlete.name}</Copy>
          <Copy muted>
            {eventName(events.find((e) => e.id === athlete.primaryEventId)!)}
          </Copy>
        </View>
      </View>
      <StatusBadge status={athlete.status} />
      {athlete.attention && <Copy muted>{athlete.attention}</Copy>}
    </AppCard>
  );
}
