import Button from "@/components/Button";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import Pdf from "react-native-pdf";
import * as Print from "expo-print";

export default function InvoicePage() {
  const { url } = useLocalSearchParams(); // passed when navigating
  console.log("url", url);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const downloadPdf = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + "invoice.pdf";
        const { uri } = await FileSystem.downloadAsync(url, fileUri);
        console.log("uri", uri);
        if (mounted) setLocalUri(uri);
      } catch (err) {
        console.error("PDF download error:", err);
      } finally {
        setLoading(false);
      }
    };
    downloadPdf();
    return () => {
      mounted = false;
    };
  }, [url]);

  const sharePdf = async () => {
    if (localUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(localUri);
    }
  };

  const printpdf = async () => {
    try {
      if (!localUri) {
        Alert.alert("Not ready", "Invoice is still downloading.");
        return;
      }
      setPrinting(true);
      const result = await Print.printAsync({
        uri: localUri,
      });
      console.log("print result:", result);
    } catch (error) {
      console.error("printPdf error:", error);
      Alert.alert("Print failed", error?.message ?? String(error));
    } finally {
      setPrinting(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View className="flex-1 justify-center p-8" style={{ flex: 1 }}>
      <Text
        className="font-bold text-primary text-2xl"
        style={{ marginBottom: 12 }}
      >
        Invoice
      </Text>

      <View style={{ flex: 1, marginBottom: 12 }}>
        {localUri ? (
          <Pdf source={{ uri: localUri }} style={{ flex: 1 }} />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>No invoice available</Text>
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Button
            name={printing ? "Printing..." : "Print"}
            onPress={printpdf}
            disabled={printing || !localUri}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <Button name="Share" onPress={sharePdf} disabled={!localUri} />
        </View>
      </View>
    </View>
  );
}
