import { StatusBar } from "expo-status-bar";
import { Component, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenCapture from "expo-screen-capture";

/**
 * Expo shell — loads the production Luma Next.js user app in a WebView.
 *
 *   cd expo-app && npm install && npx expo start
 *   eas build --platform android --profile preview
 */
const LUMA_URL =
  process.env.EXPO_PUBLIC_LUMA_WEB_URL || "https://luma-user.onrender.com";

type BoundaryState = { error: Error | null };

class AppErrorBoundary extends Component<
  { children: React.ReactNode; onReset?: () => void },
  BoundaryState
> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={styles.root}>
          <View style={styles.center}>
            <Text style={styles.title}>Luma hit a snag</Text>
            <Text style={styles.sub}>{this.state.error.message}</Text>
            <Pressable
              style={styles.btn}
              onPress={() => {
                this.setState({ error: null });
                this.props.onReset?.();
              }}
            >
              <Text style={styles.btnText}>Try again</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

function LumaWebShell() {
  const [webKey, setWebKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ok = await ScreenCapture.isAvailableAsync();
        if (!cancelled && ok) {
          await ScreenCapture.preventScreenCaptureAsync("luma");
        }
      } catch {
        /* never crash the shell for FlagSecure */
      }
    })();
    return () => {
      cancelled = true;
      void ScreenCapture.allowScreenCaptureAsync("luma").catch(() => undefined);
    };
  }, []);

  const reload = useCallback(() => {
    setLoadError(null);
    setLoading(true);
    setWebKey((k) => k + 1);
  }, []);

  const source = useMemo(() => ({ uri: LUMA_URL }), []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.frame}>
        {loadError ? (
          <View style={styles.center}>
            <Text style={styles.title}>Couldn’t open Luma</Text>
            <Text style={styles.sub}>{loadError}</Text>
            <Text style={styles.meta}>{LUMA_URL}</Text>
            <Pressable style={styles.btn} onPress={reload}>
              <Text style={styles.btnText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <WebView
              key={webKey}
              source={source}
              style={styles.webview}
              onLoadStart={() => {
                setLoading(true);
                setLoadError(null);
              }}
              onLoadEnd={() => setLoading(false)}
              onError={(e) => {
                setLoading(false);
                setLoadError(
                  e.nativeEvent?.description || "WebView failed to load",
                );
              }}
              onHttpError={(e) => {
                if (e.nativeEvent.statusCode >= 500) {
                  setLoadError(`Server error ${e.nativeEvent.statusCode}`);
                }
              }}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState={false}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              setSupportMultipleWindows={false}
              originWhitelist={["*"]}
              mixedContentMode="always"
              androidLayerType="hardware"
              nestedScrollEnabled
              // iOS-only extras — cast keeps Android builds free of crashy prop wiring
              {...(Platform.OS === "ios"
                ? ({
                    allowsBackForwardNavigationGestures: true,
                    allowsAirPlayForMediaPlayback: true,
                    mediaCapturePermissionGrantType: "grant",
                  } as Record<string, unknown>)
                : {})}
            />
            {loading ? (
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator color="#2ee6c5" size="large" />
                <Text style={styles.meta}>Opening Luma…</Text>
              </View>
            ) : null}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [shellKey, setShellKey] = useState(0);
  return (
    <AppErrorBoundary onReset={() => setShellKey((k) => k + 1)}>
      <LumaWebShell key={shellKey} />
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0b0d12" },
  frame: { flex: 1 },
  webview: { flex: 1, backgroundColor: "#0b0d12" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 12,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  sub: { color: "#9aa3b2", fontSize: 14, textAlign: "center" },
  meta: { color: "#6b7280", fontSize: 12, textAlign: "center", marginTop: 4 },
  btn: {
    marginTop: 10,
    backgroundColor: "#2ee6c5",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { color: "#0b0d12", fontWeight: "800", fontSize: 15 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(11,13,18,0.72)",
    gap: 10,
  },
});
