import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SectionCard } from "./src/components/SectionCard";
import { buildCatalog } from "./src/data/buildCatalog";
import { brickCatalog } from "./src/data/brickCatalog";
import { analyzeImageWithBackend } from "./src/lib/backendScanner";
import { getBuildMatches } from "./src/lib/buildMatcher";
import { colors, spacing } from "./src/theme";
import {
  BrickDefinition,
  BrickInventory,
  BuildRecipe,
  DetectedPart,
  RealBuildMatch,
  ScanSession,
  TabId,
} from "./src/types";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("scan");
  const [inventory, setInventory] = useState<BrickInventory>({});
  const [partsCatalog, setPartsCatalog] = useState<Record<string, BrickDefinition>>(
    () => Object.fromEntries(brickCatalog.map((brick) => [brick.id, brick]))
  );
  const [sessions, setSessions] = useState<ScanSession[]>([]);
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
  const [lastDetectedParts, setLastDetectedParts] = useState<DetectedPart[]>([]);
  const [realBuilds, setRealBuilds] = useState<RealBuildMatch[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(
    "Scan a pile or tray of LEGO pieces to grow your inventory."
  );

  const matches = useMemo(() => {
    return getBuildMatches(inventory, buildCatalog).filter(
      (match) => match.coverage > 0
    );
  }, [inventory]);

  const selectedBuild =
    matches.find((match) => match.recipe.id === selectedBuildId)?.recipe ??
    matches[0]?.recipe;

  const applyScanResult = (
    result: {
      detectedBricks: BrickInventory;
      detectedParts?: DetectedPart[];
      realBuilds?: RealBuildMatch[];
      session: ScanSession;
      notes?: string;
    },
    successMessage: string
  ) => {
    if (result.detectedParts?.length) {
      mergeDetectedPartsIntoCatalog(result.detectedParts, setPartsCatalog);
    }

    const nextInventory = mergeInventory(inventory, result.detectedBricks);
    const nextMatches = getBuildMatches(nextInventory, buildCatalog);

    setInventory(nextInventory);
    setLastDetectedParts(result.detectedParts ?? []);
    setRealBuilds(result.realBuilds ?? []);
    setSessions((current) => [result.session, ...current].slice(0, 6));
    setSelectedBuildId(nextMatches[0]?.recipe.id ?? null);
    setActiveTab("builds");
    setScanMessage(successMessage);
  };

  const handleScanFromUri = async (imageUri: string) => {
    try {
      const result = await analyzeImageWithBackend(imageUri);
      applyScanResult(
        result,
        result.session.detectedCount > 0
          ? `Live scan found ${result.session.detectedCount} matching pieces. ${result.notes ?? ""}`.trim()
          : `Live scan completed but did not confidently detect pieces. ${result.notes ?? ""}`.trim()
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown scan error.";
      setScanMessage(message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTakePhoto = async () => {
    setIsScanning(true);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setScanMessage("Camera permission is needed to scan your LEGO collection.");
      setIsScanning(false);
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (pickerResult.canceled) {
      setScanMessage("Camera scan canceled.");
      setIsScanning(false);
      return;
    }

    const imageUri = pickerResult.assets[0]?.uri;
    if (!imageUri) {
      setScanMessage("Photo scan failed because no image URI was returned.");
      setIsScanning(false);
      return;
    }

    await handleScanFromUri(imageUri);
  };

  const handleChooseFromPhotos = async () => {
    setIsScanning(true);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setScanMessage("Photo library permission is needed to choose a LEGO photo.");
      setIsScanning(false);
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (pickerResult.canceled) {
      setScanMessage("Photo selection canceled.");
      setIsScanning(false);
      return;
    }

    const imageUri = pickerResult.assets[0]?.uri;
    if (!imageUri) {
      setScanMessage("Photo selection failed because no image URI was returned.");
      setIsScanning(false);
      return;
    }

    await handleScanFromUri(imageUri);
  };

  const bumpBrick = (brickId: string, delta: number) => {
    setInventory((current) => {
      const nextValue = Math.max((current[brickId] ?? 0) + delta, 0);
      return { ...current, [brickId]: nextValue };
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Brickwise</Text>
          <Text style={styles.title}>Scan your LEGO stash and find builds you can make right now.</Text>
          <Text style={styles.subtitle}>
            This MVP tracks scanned pieces, compares them against a build library, and shows step-by-step instructions.
          </Text>
        </View>

        <View style={styles.tabs}>
          {[
            ["scan", "Scan"],
            ["builds", "Builds"],
            ["inventory", "Inventory"],
          ].map(([id, label]) => (
            <Pressable
              key={id}
              onPress={() => setActiveTab(id as TabId)}
              style={[
                styles.tabButton,
                activeTab === id && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === id && styles.tabButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === "scan" && (
            <>
              <SectionCard
                title="Quick Scan"
                eyebrow="Inventory Capture"
                description={scanMessage}
              >
                <View style={styles.scanActions}>
                  <Pressable
                    disabled={isScanning}
                    onPress={handleTakePhoto}
                    style={[styles.primaryButton, isScanning && styles.buttonDisabled]}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isScanning ? "Scanning..." : "Take Photo"}
                    </Text>
                  </Pressable>
                  <Pressable
                    disabled={isScanning}
                    onPress={handleChooseFromPhotos}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Choose From Photos</Text>
                  </Pressable>
                </View>
                <Text style={styles.helperText}>
                  Scan a new picture or pick an existing one. The app sends it to your backend, which uses OpenAI Vision plus Rebrickable lookup.
                </Text>
              </SectionCard>

              <SectionCard
                title="Recent Scan Sessions"
                eyebrow="History"
                description="Each scan adds to your saved inventory so build matches improve over time."
              >
                {sessions.length === 0 ? (
                  <Text style={styles.emptyText}>No scans yet. Take a photo or choose one from your library to populate the app.</Text>
                ) : (
                  sessions.map((session) => (
                    <View key={session.id} style={styles.sessionRow}>
                      <View>
                        <Text style={styles.sessionLabel}>{session.label}</Text>
                        <Text style={styles.sessionMeta}>
                          {session.detectedCount} pieces detected
                        </Text>
                        <Text style={styles.sessionMeta}>
                          {(session.source ?? "demo") === "openai" ? "Live vision scan" : "Demo scan"}
                        </Text>
                      </View>
                      <Text style={styles.sessionConfidence}>
                        {Math.round(session.confidence * 100)}%
                      </Text>
                    </View>
                  ))
                )}
              </SectionCard>
            </>
          )}

          {activeTab === "builds" && (
            <>
              <SectionCard
                title="Detected Pieces"
                eyebrow="Last Scan"
                description="These are the pieces the most recent photo appears to contain."
              >
                {lastDetectedParts.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No pieces detected yet. Take or choose a photo from the Scan tab.
                  </Text>
                ) : (
                  lastDetectedParts.map((part) => (
                    <View key={`${part.id}-${part.quantity}`} style={styles.requirementRow}>
                      <View style={styles.detectedPartText}>
                        <Text style={styles.requirementName}>{part.name}</Text>
                        <Text style={styles.inventoryMeta}>
                          {part.color} • {part.category}
                          {part.partNum ? ` • ${part.partNum}` : ""}
                        </Text>
                      </View>
                      <Text style={styles.detectedQuantity}>x{part.quantity}</Text>
                    </View>
                  ))
                )}
              </SectionCard>

              <SectionCard
                title="Official Set Matches"
                eyebrow="Rebrickable"
                description="These official LEGO sets are estimated from your scanned collection using Rebrickable part inventories."
              >
                {realBuilds.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No official set matches yet. Scan more pieces or try a clearer photo.
                  </Text>
                ) : (
                  realBuilds.map((match) => (
                    <View key={match.id} style={styles.matchCard}>
                      <View style={styles.matchHeader}>
                        <Text style={styles.matchTitle}>{match.name}</Text>
                        <Text style={styles.matchScore}>{Math.round(match.coverage * 100)}%</Text>
                      </View>
                      <Text style={styles.matchDescription}>
                        {match.theme ? `${match.theme} • ` : ""}
                        {match.year ? `${match.year} • ` : ""}
                        {match.setNum}
                      </Text>
                      <Text style={styles.matchMeta}>
                        {match.missingPieces === 0
                          ? "Buildable now"
                          : `${match.missingPieces} more pieces needed`}
                      </Text>
                    </View>
                  ))
                )}
              </SectionCard>

              {matches.length > 0 && selectedBuild ? (
                <BuildInstructions recipe={selectedBuild} inventory={inventory} />
              ) : (
                <SectionCard
                  title="Sample Build Instructions"
                  eyebrow="Included Recipes"
                  description="These are the built-in instructions available in this MVP when your detected pieces overlap the sample recipe library."
                >
                  <Text style={styles.emptyText}>
                    No sample recipe matches yet. Official set matches above come from Rebrickable, while step-by-step in-app instructions currently exist only for the included sample builds.
                  </Text>
                </SectionCard>
              )}
            </>
          )}

          {activeTab === "inventory" && (
            <SectionCard
              title="Your Inventory"
              eyebrow="Pieces"
              description="Adjust counts manually if a scan misses something."
            >
              {Object.values(partsCatalog)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((brick) => (
                  <View key={brick.id} style={styles.inventoryRow}>
                    <View style={styles.inventoryText}>
                      <Text style={styles.inventoryName}>{brick.name}</Text>
                      <Text style={styles.inventoryMeta}>
                        {brick.color} • {brick.category}
                        {brick.partNum ? ` • ${brick.partNum}` : ""}
                      </Text>
                    </View>
                    <View style={styles.counter}>
                      <Pressable onPress={() => bumpBrick(brick.id, -1)} style={styles.counterButton}>
                        <Text style={styles.counterButtonText}>-</Text>
                      </Pressable>
                      <Text style={styles.counterValue}>{inventory[brick.id] ?? 0}</Text>
                      <Pressable onPress={() => bumpBrick(brick.id, 1)} style={styles.counterButton}>
                        <Text style={styles.counterButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
            </SectionCard>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function BuildInstructions({
  recipe,
  inventory,
}: {
  recipe: BuildRecipe;
  inventory: BrickInventory;
}) {
  return (
    <SectionCard
      title={recipe.name}
      eyebrow="Instructions"
      description={recipe.summary}
    >
      <View style={styles.recipeStats}>
        <Stat label="Difficulty" value={recipe.difficulty} />
        <Stat label="Build Time" value={recipe.buildTime} />
        <Stat label="Theme" value={recipe.theme} />
      </View>

      <Text style={styles.requirementsTitle}>Required Pieces</Text>
      {Object.entries(recipe.requirements).map(([brickId, count]) => {
        const brick = brickCatalog.find((entry) => entry.id === brickId);
        const owned = inventory[brickId] ?? 0;
        const enough = owned >= count;

        return (
          <View key={brickId} style={styles.requirementRow}>
            <Text style={styles.requirementName}>
              {brick?.name ?? brickId}
            </Text>
            <Text style={[styles.requirementCount, enough ? styles.good : styles.warn]}>
              {owned}/{count}
            </Text>
          </View>
        );
      })}

      <Text style={styles.requirementsTitle}>Steps</Text>
      {recipe.steps.map((step, index) => (
        <View key={`${recipe.id}-${index}`} style={styles.stepRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </SectionCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function mergeInventory(
  current: BrickInventory,
  additions: BrickInventory
): BrickInventory {
  const merged = { ...current };

  Object.entries(additions).forEach(([brickId, count]) => {
    merged[brickId] = (merged[brickId] ?? 0) + count;
  });

  return merged;
}

function countBricks(inventory: BrickInventory) {
  return Object.values(inventory).reduce((sum, count) => sum + count, 0);
}

function mergeDetectedPartsIntoCatalog(
  detectedParts: DetectedPart[],
  setPartsCatalog: Dispatch<SetStateAction<Record<string, BrickDefinition>>>
) {
  setPartsCatalog((current) => {
    const next = { ...current };

    detectedParts.forEach((part) => {
      next[part.id] = {
        ...current[part.id],
        ...part,
      };
    });

    return next;
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shell: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  hero: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  kicker: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.cardMuted,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.text,
  },
  tabButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
  tabButtonTextActive: {
    color: colors.background,
  },
  content: {
    paddingBottom: 40,
    gap: spacing.md,
  },
  scanActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.cardMuted,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  helperText: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sessionLabel: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  sessionMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  sessionConfidence: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 16,
  },
  matchCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.cardMuted,
  },
  matchCardActive: {
    borderColor: colors.accent,
    backgroundColor: "#fff7eb",
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  matchTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  matchScore: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "800",
  },
  matchDescription: {
    color: colors.muted,
    lineHeight: 20,
  },
  matchMeta: {
    marginTop: spacing.sm,
    color: colors.text,
    fontWeight: "700",
  },
  recipeStats: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardMuted,
    borderRadius: 16,
    padding: spacing.sm,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  statValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
  requirementsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  requirementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  requirementName: {
    color: colors.text,
    fontSize: 15,
  },
  requirementCount: {
    fontSize: 15,
    fontWeight: "800",
  },
  detectedPartText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  detectedQuantity: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  good: {
    color: colors.success,
  },
  warn: {
    color: colors.warning,
  },
  stepRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "flex-start",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepBadgeText: {
    color: colors.background,
    fontWeight: "800",
  },
  stepText: {
    flex: 1,
    color: colors.text,
    lineHeight: 22,
  },
  inventoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inventoryText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  inventoryName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  inventoryMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  counterButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  counterValue: {
    minWidth: 24,
    textAlign: "center",
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
});

export default App;
