import React from "react";
import { Image, Text, View } from "react-native";

interface ProductCardProps {
  specsName: string;
  price: number;
  discountPrice: number;
  imageurl: any;
  quantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  specsName,
  price,
  discountPrice,
  imageurl,
  quantity,
}) => {
  return (
    <View className="flex-row items-start mb-4 bg-[#F8F8F8] p-3">
      <Image source={imageurl} className="w-16 h-20 mr-3 rounded-lg" />

      <View className="flex-1">
        {/* 👇 this will wrap into multiple lines */}
        <Text className="text-base font-semibold flex-shrink font-regular text-lg">
          {specsName}
        </Text>

        <Text className="text-gray-500 line-through font-semibold text-[14px]">
          ₹{price}
        </Text>
        <View className="flex-row justify-between items-start mt-2">
          <Text className="text-primary font-bold text-[18px]">
            ₹{discountPrice}
          </Text>
          <View className="border px-2 py-1 border-primary rounded-xl">
            <Text className="text-primary font-semibold">Qty: {quantity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
