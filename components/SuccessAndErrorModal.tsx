import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "./Button";
interface SuccessAndErrorModalProps {
  status: "loading" | "success" | "error" | "";
  message: string;
  button: string;
  onPress?: () => void;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessAndErrorModal: React.FC<SuccessAndErrorModalProps> = ({
  status,
  message,
  button,
  onPress,
  modalOpen,
  setModalOpen,
}) => {
  const animationRef = useRef<LottieView>(null);
  useEffect(() => {
    if (modalOpen && animationRef.current) {
      animationRef.current.play();
    }
  }, [modalOpen, status]);

  const getAnimation = () => {
    switch (status) {
      case "loading":
        return require("../assets/animation-json/Loading.json");
      case "success":
        return require("../assets/animation-json/Success.json");
      case "error":
        return require("../assets/animation-json/Error.json");
      default:
        return null;
    }
  };

  if (!status) return null;
  return (
    <Modal transparent visible={modalOpen} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.container}>
            {status === "loading" && (
              <LottieView
                ref={animationRef}
                source={getAnimation()}
                autoPlay
                loop
                style={{ width: 100, height: 100 }}
              />
            )}
            <View style={{ alignItems: "center" }}>
              {status === "success" ? (
                <LottieView
                  ref={animationRef}
                  source={getAnimation()}
                  autoPlay
                  loop={false}
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <LottieView
                  ref={animationRef}
                  source={getAnimation()}
                  autoPlay
                  loop={false}
                  style={{ width: 100, height: 100 }}
                />
              )}
            </View>
            <Text style={styles.message}> {message}</Text>
            <Button
              name={button || "OK"}
              onPress={onPress || (() => setModalOpen(false))}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SuccessAndErrorModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    // alignItems: "center",
  },
  message: {
    marginBottom: 5,
    fontSize: 16,
    textAlign: "center",
  },
});
