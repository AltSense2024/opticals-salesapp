import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  id: string;
  index: number;
  specsName: string;
  price?: number;
  quantity: number; // initial quantity
  imageurl: any;
  total_amount?: number;
  discount?: number;
  gst?: number;
  setFieldValue: (field: string, value: any) => void;
  deleteProduct: () => void;
  onPress: () => void;
  onChangeQuantity: (newQty: number) => void;
}

const OrderProductCard: React.FC<ProductCardProps> = ({
  id,
  index,
  specsName,
  price,
  quantity,
  imageurl,
  total_amount,
  discount,
  gst = 12,
  setFieldValue,
  onPress,
  deleteProduct,
  onChangeQuantity,
}) => {
  const handleDecrease = () => {
    const currentQuantity = Number(quantity);

    if (currentQuantity > 1) {
      onChangeQuantity(currentQuantity - 1);
    }
  };

  const handleIncrease = () => {
    const currentQuantity = Number(quantity);

    if (currentQuantity >= 1) {
      onChangeQuantity(currentQuantity + 1);
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className="flex-row items-start my-3 bg-[#F8F8F8] p-3 rounded-xl"
        style={{
          // Card elevation
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Image source={imageurl} className="w-16 h-20 mr-3 rounded-lg" />
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-md font-extrabold text-primary">
              {specsName}{" "}
            </Text>
            <Text className="text-semibold   font-semibold text-[14px]">
              ₹ {total_amount}
            </Text>
          </View>
          {/* <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center  ">
              <TouchableOpacity
                onPress={handleDecrease}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
                className="px-1 bg-white rounded-full"
              >
                <Text className="text-lg font-bold">-</Text>
              </TouchableOpacity>

              <Text className="mx-3 text-base">{Number(quantity)}</Text>

              <TouchableOpacity
                onPress={handleIncrease}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
                className="px-1 bg-white rounded-full"
              >
                <Text className="text-lg font-bold">+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={deleteProduct}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View> */}
          <View className="flex-row justify-between py-1">
            <Text className="text-[12px] font-semibold">Item subtotal</Text>
            <Text className="text-[12px] font-semibold">
              {quantity} x {price} = ₹ {quantity * (price ? price : 0)}
            </Text>
          </View>
          <View className=" flex-row justify-between py-1">
            <Text className="text-[13px] font-semibold">
              Discount (%):{discount}{" "}
            </Text>
            <Text className="text-[12px] font-semibold">
              ₹
              {(((discount || 0) / 100) * ((price || 0) * quantity)).toFixed(2)}
            </Text>
          </View>
          <View className=" flex-row justify-between py-1">
            <Text className="text-[12px] font-semibold">Tax GST@:{gst}% </Text>
            <Text className="text-[12px] font-semibold">
              ₹ {((gst / 100) * (total_amount ? total_amount : 0)).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderProductCard;
