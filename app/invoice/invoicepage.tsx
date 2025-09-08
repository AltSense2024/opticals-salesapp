import Button from "@/components/Button";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function InvoicePage() {
  // const { url } = useLocalSearchParams(); // passed when navigating
  const url =
    "https://nfzrotftbjkcgmzochwq.supabase.co/storage/v1/object/sign/Invoices/invoice/INV-30082025-004.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZTkwNTEwMS1kMzkzLTQ5OTAtOGYwMy1mNDk5YWQ1NWVkOWQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbnZvaWNlcy9pbnZvaWNlL0lOVi0zMDA4MjAyNS0wMDQucGRmIiwiaWF0IjoxNzU2NzEzMzE2LCJleHAiOjE3NTkzMDUzMTZ9.ZquDAs24wBq1gVCsPdpYgFrCDzI6YkExXhyiInCb5cU";
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const downloadPdf = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + "invoice.pdf";
        const { uri } = await FileSystem.downloadAsync(url, fileUri);
        console.log("uri", uri);
        setLocalUri(uri);
      } catch (err) {
        console.error("PDF download error:", err);
      } finally {
        setLoading(false);
      }
    };
    downloadPdf();
  }, [url]);

  const sharePdf = async () => {
    if (localUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(localUri);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View className="flex-[1] justify-center p-8">
      <Text className="font-bold text-primary text-2xl"> Invoice </Text>
      {/* <View style={{ height: 10 }} /> */}
      {/* <View style={{ flex: 1 }}>
        <Pdf source={{ uri: localUri ?? " " }} style={{ flex: 1 }} />
      </View> */}
      <Button name="Share Invoice" onPress={sharePdf} />
    </View>
  );
}
