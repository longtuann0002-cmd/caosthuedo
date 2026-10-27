import { Camera, RentalContract, Customer, Expense } from '../types';

export const INITIAL_CAMERAS: Camera[] = [
  {
    "name": "Váy ngắn ren hoa  (Size S)",
    "shortName": "VN RH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 400000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 80000,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN RH-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_RH-S_0.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Đen tuyền"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793080316362-0"
  },
  {
    "name": "Váy ngắn ren hoa  (Size M)",
    "shortName": "VN RH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 400000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 80000,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN RH-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_RH-M_1.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Đen tuyền"
      ]
    },
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793080316362-1"
  },
  {
    "name": "Áo dài 2 lớp ren trong (Size S)",
    "shortName": "AD 2LRT",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 460000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD 2LRT-S-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_2LRT-S-1_2.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Xanh lá",
      "S": "Hồng phấn"
    },
    "sizeQtyMap": {
      "S": 2
    },
    "sizeColorVariants": {
      "M": [
        "Xanh lá"
      ],
      "S": [
        "Hồng phấn",
        "Tím mộng mơ"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793080473167-0"
  },
  {
    "name": "Áo dài 2 lớp ren trong (Size S)",
    "shortName": "AD 2LRT",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 460000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD 2LRT-S-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_2LRT-S-2_3.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Xanh lá",
      "S": "Hồng phấn"
    },
    "sizeQtyMap": {
      "S": 2
    },
    "sizeColorVariants": {
      "M": [
        "Xanh lá"
      ],
      "S": [
        "Hồng phấn",
        "Tím mộng mơ"
      ]
    },
    "color": "Tím mộng mơ",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793080473168-1"
  },
  {
    "name": "Áo dài 2 lớp ren trong (Size M)",
    "shortName": "AD 2LRT",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 460000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD 2LRT-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_2LRT-M_4.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Xanh lá",
      "S": "Hồng phấn"
    },
    "sizeQtyMap": {
      "S": 2
    },
    "sizeColorVariants": {
      "M": [
        "Xanh lá"
      ],
      "S": [
        "Hồng phấn",
        "Tím mộng mơ"
      ]
    },
    "color": "Xanh lá",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793080473168-2"
  },
  {
    "id": "outfit-1793080538822-0",
    "name": "Áo dài 2 lớp tơ thường",
    "shortName": "AD 2LTT",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 460000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD 2LTT",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_2LTT_5.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Xanh lá",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Xanh lá"
      ]
    },
    "color": "Xanh lá",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793080753676-0",
    "name": "Áo dài khuy tàu - tơ choàng",
    "shortName": "AD KTTC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 500000,
    "dailyRate": 180000,
    "price1Day": 180000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD KTTC",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_KTTC_6.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793080893179-0",
    "name": " áo dài hồng - tơ choàng",
    "shortName": "AD HTC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 490000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD HTC",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_HTC_7.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Hồng tím"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Hồng tím"
      ]
    },
    "color": "Hồng tím",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Hà Hường",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793080967678-0",
    "name": "Đầm lụa sẻ tà ",
    "shortName": "ĐL ST",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 420000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "ĐL ST",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam__L_ST_8.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793081339088-0",
    "name": "Đầm lụa soắn vai",
    "shortName": "ĐL SV",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 380000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "ĐL SV",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam__L_SV_9.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793081540192-0",
    "name": "Đầm cup nâu + khăn choàng",
    "shortName": "ĐCN KC",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 480000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 400000,
    "status": "Available",
    "serialNumber": "ĐCN KC",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam__CN_KC_10.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Nâu tây"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Nâu tây"
      ]
    },
    "color": "Nâu tây",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "name": "Váy ngắn cup ngực + áo choàng (Size S)",
    "shortName": "VN CNAC",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 690000,
    "dailyRate": 180000,
    "price1Day": 180000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 400000,
    "status": "Available",
    "serialNumber": "VN CNAC-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_CNAC-S_11.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793081622250-0"
  },
  {
    "name": "Váy ngắn cup ngực + áo choàng (Size M)",
    "shortName": "VN CNAC",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 690000,
    "dailyRate": 180000,
    "price1Day": 180000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 400000,
    "status": "Available",
    "serialNumber": "VN CNAC-M",
    "description": "",
    "image": "data:image/jpeg;base64,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",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793081622250-1"
  },
  {
    "id": "outfit-1793081753377-0",
    "name": "Đầm dài ren xẻ ngực ",
    "shortName": "ĐDRXN",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 750000,
    "dailyRate": 200000,
    "price1Day": 200000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 500000,
    "status": "Available",
    "serialNumber": "ĐDRXN",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam__DRXN_13.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793081821936-0",
    "name": "Đầm cup ren KA",
    "shortName": "ĐCR",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 680000,
    "dailyRate": 200000,
    "price1Day": 200000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 400000,
    "status": "Available",
    "serialNumber": "ĐCR",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam__CR_14.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Nâu tây"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Nâu tây"
      ]
    },
    "color": "Nâu tây",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793081891462-0",
    "name": "Váy ngắn đen trễ vai ",
    "shortName": "VN ĐTV",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 490000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 400000,
    "status": "Available",
    "serialNumber": "VN ĐTV",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN__TV_15.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Đen tuyền"
      ]
    },
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793082004788-0",
    "name": "Váy ngắn ren 5 chiếc nơ",
    "shortName": "VN R5N",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 520000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 400000,
    "status": "Available",
    "serialNumber": "VN R5N",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_R5N_16.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "",
      "S": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793082552126-0",
    "name": "Váy ngắn khoét ngực cài hoa vai",
    "shortName": "VN KNCHV",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 680000,
    "dailyRate": 180000,
    "price1Day": 180000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 400000,
    "status": "Available",
    "serialNumber": "VN KNCHV",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_KNCHV_17.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793082615194-0",
    "name": "Váy dài ren cổ cao khoét lưng",
    "shortName": "VD RCCKL",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 750000,
    "dailyRate": 200000,
    "price1Day": 200000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 500000,
    "status": "Available",
    "serialNumber": "VD RCCKL",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VD_RCCKL_18.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu Hy",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793082699872-0",
    "name": "Áo dài 3 mảnh yếm (Size M)",
    "shortName": "AD 3MY",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 630000,
    "dailyRate": 180000,
    "price1Day": 180000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD 3MY",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_3MY_19.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Mie",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793082911972-0",
    "name": "Áo dài quần ren tay ren",
    "shortName": "AD QRTR",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 450000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD QRTR",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_QRTR_20.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Mie",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793083024897-0",
    "name": "Áo dài bướm đỏ",
    "shortName": "AD BĐ",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 460000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD BĐ",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_B__21.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đỏ đô"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Đỏ đô"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Mie",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793083112960-0",
    "name": "Áo dài xanh lá 2 tà",
    "shortName": "AD XL2T",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 460000,
    "dailyRate": 150000,
    "price1Day": 150000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD XL2T",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_XL2T_22.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "xanh lá"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "xanh lá"
      ]
    },
    "color": "xanh lá",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Mie",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793083218709-0",
    "name": "Váy ngắn 2 dây có choàng tay dài",
    "shortName": "VN 2DCCTD",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 340000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN 2DCCTD",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_2DCCTD_23.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu nhi",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793083262992-0",
    "name": "Váy ngắn 4 nơ",
    "shortName": "VN4N",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 350000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN4N",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN4N_24.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu nhi",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793083326428-0",
    "name": "Váy dài sát nách hoa",
    "shortName": "VDSNH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 370000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VDSNH",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VDSNH_25.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Châu nhi",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793083484853-0",
    "name": "váy ngắn set ren 2 dây",
    "shortName": "VN SR2D",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 370000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN SR2D",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_SR2D_26.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Nâu tây",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Nâu tây"
      ]
    },
    "color": "Nâu tây",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "linh chery",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "name": "Váy ngắn 2 dây choàng (Size S)",
    "shortName": "VN 2DC",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 300000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN 2DC-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_2DC-S_27.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "linh chery",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793083570165-0"
  },
  {
    "name": "Váy ngắn 2 dây choàng (Size M)",
    "shortName": "VN 2DC",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 300000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN 2DC-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_2DC-M_28.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "linh chery",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793083570165-1"
  },
  {
    "id": "outfit-1793083647550-0",
    "name": "Váy ngắn ren tay dài",
    "shortName": "VN RTD",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 420000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN RTD",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_RTD_29.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Nâu tây"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Nâu tây"
      ]
    },
    "color": "Nâu tây",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "linh chery",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793083712220-0",
    "name": "Váy yếm ngắn fomt chữ A",
    "shortName": "VN YFCA",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 340000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "VN YFCA",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_YFCA_30.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "linh chery",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "name": "Áo dài ren choàng (Size S)",
    "shortName": "AD RC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 340000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD RC-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_RC-S_31.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793083814701-0"
  },
  {
    "name": "Áo dài ren choàng (Size M)",
    "shortName": "AD RC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 340000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "AD RC-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_RC-M_32.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793083814701-1"
  },
  {
    "name": "Set ngắn đền lồng (Size S)",
    "shortName": "SN ĐL",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 320000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "SN ĐL-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_SN__L-S_33.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Xanh pastel",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Xanh pastel"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Xanh pastel",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793083907688-0"
  },
  {
    "name": "Set ngắn đền lồng (Size M)",
    "shortName": "SN ĐL",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 320000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "SN ĐL-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_SN__L-M_34.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Xanh pastel",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Xanh pastel"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793083907688-1"
  },
  {
    "name": "Set yếm bèo cổ ngọc trai (Size S)",
    "shortName": "SY BCNT",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 300000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "SY BCNT-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_SY_BCNT-S_35.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793084068163-0"
  },
  {
    "name": "Set yếm bèo cổ ngọc trai (Size M)",
    "shortName": "SY BCNT",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 300000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 300000,
    "status": "Available",
    "serialNumber": "SY BCNT-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_SY_BCNT-M_36.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793084068163-1"
  },
  {
    "id": "outfit-1793084295097-0",
    "name": "Váy ngắn chữ A chân hoa",
    "shortName": "VN CACH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 420000,
    "dailyRate": 130000,
    "price1Day": 130000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "VN CACH",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_CACH_37.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793084334456-0",
    "name": "Váy ngắn lưới cổ ngọc trai",
    "shortName": "VN LCNT",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 280000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "VN LCNT",
    "description": "",
    "image": "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Nâu tây",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Nâu tây"
      ]
    },
    "color": "Nâu tây",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "name": "Váy ngắn tay dài lệch vai hoa (Size S)",
    "shortName": "VN TDLVH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 280000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "VN TDLVH-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_TDLVH-S_39.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Đen tuyền"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793084402966-0"
  },
  {
    "name": "Váy ngắn tay dài lệch vai hoa (Size M)",
    "shortName": "VN TDLVH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 280000,
    "dailyRate": 80000,
    "price1Day": 80000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "VN TDLVH-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_TDLVH-M_40.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Đen tuyền"
      ]
    },
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793084402966-1"
  },
  {
    "name": "Váy ngắn trễ vai hoa (Size S)",
    "shortName": "VN TVH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 290000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "VN TVH-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_TVH-S_41.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793084469840-0"
  },
  {
    "name": "Váy ngắn trễ vai hoa (Size M)",
    "shortName": "VN TVH",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 290000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "VN TVH-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_TVH-M_42.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ],
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793084469840-1"
  },
  {
    "id": "outfit-1793084555284-0",
    "name": "Váy ngắn dài tay lệch tay",
    "shortName": "VNDTLT",
    "category": "Váy",
    "isPrinter": false,
    "purchasePrice": 320000,
    "dailyRate": 100000,
    "price1Day": 100000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "VNDTLT",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VNDTLT_43.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Kun xinh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "name": "Guốc mộc (Size S)",
    "shortName": "GM-S-1",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 120000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GM-S-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_GM-S-1_44.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793085229961-0"
  },
  {
    "name": "Guốc mộc (Size S)",
    "shortName": "GM",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 120000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GM-S-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_GM-S-2_45.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Đen tuyền",
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {
      "S": 2,
      "M": 2
    },
    "sizeColorVariants": {
      "S": [
        "Đen tuyền",
        "Đen tuyền"
      ],
      "M": [
        "Đen tuyền",
        "Đen tuyền"
      ]
    },
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793085229961-1"
  },
  {
    "name": "Guốc mộc (Size M)",
    "shortName": "GM",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 120000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GM-M-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_GM-M-1_46.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Đen tuyền",
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {
      "S": 2,
      "M": 2
    },
    "sizeColorVariants": {
      "S": [
        "Đen tuyền",
        "Đen tuyền"
      ],
      "M": [
        "Đen tuyền",
        "Đen tuyền"
      ]
    },
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793085229961-2"
  },
  {
    "name": "Guốc mộc (Size M)",
    "shortName": "GM",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 120000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GM-M-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_GM-M-2_47.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Đen tuyền",
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {
      "S": 2,
      "M": 2
    },
    "sizeColorVariants": {
      "S": [
        "Đen tuyền",
        "Đen tuyền"
      ],
      "M": [
        "Đen tuyền",
        "Đen tuyền"
      ]
    },
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793085229962-3"
  },
  {
    "id": "outfit-1793085663622-0",
    "name": "Guốc đen nơ (Size M)",
    "shortName": "GĐN",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 141000,
    "dailyRate": 30000,
    "price1Day": 30000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GĐN",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_G_N_48.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793085732415-0",
    "name": "Guốc nâu nơ (Size M)",
    "shortName": "GGNN",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 173000,
    "dailyRate": 30000,
    "price1Day": 30000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GGNN",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_GGNN_49.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Nâu tây"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "Nâu tây",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793085823682-0",
    "name": "Guốc ren nơ",
    "shortName": "GRN",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 260000,
    "dailyRate": 30000,
    "price1Day": 30000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GRN",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_GRN_50.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793085868180-0",
    "name": "Guốc đen óng ánh",
    "shortName": "GĐOA",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 114000,
    "dailyRate": 30000,
    "price1Day": 30000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "GĐOA",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_G_OA_51.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đen tuyền"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Đen tuyền"
      ]
    },
    "color": "Đen tuyền",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086002563-0",
    "name": "Túi gấm hoa",
    "shortName": "TGH",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 50000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "TGH-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_TGH-1_52.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Hồng phấn",
        "Đỏ đô",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086002563-1",
    "name": "Túi gấm hoa",
    "shortName": "TGH",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 50000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "TGH-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_TGH-2_53.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Hồng phấn",
        "Đỏ đô",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086002563-2",
    "name": "Túi gấm hoa",
    "shortName": "TGH",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 50000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "TGH-3",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_TGH-3_54.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Hồng phấn",
        "Đỏ đô",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086002563-3",
    "name": "Túi gấm hoa",
    "shortName": "TGH",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 50000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "TGH-4",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_TGH-4_55.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Hồng phấn",
        "Đỏ đô",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086065532-0",
    "name": "Quạt gỗ",
    "shortName": "QG",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 19000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "QG-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_QG-1_56.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {
      "M": 5
    },
    "sizeColorVariants": {
      "M": [
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086065532-1",
    "name": "Quạt gỗ",
    "shortName": "QG",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 19000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "QG-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_QG-2_57.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {
      "M": 5
    },
    "sizeColorVariants": {
      "M": [
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086065532-2",
    "name": "Quạt gỗ",
    "shortName": "QG",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 19000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "QG-3",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_QG-3_58.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {
      "M": 5
    },
    "sizeColorVariants": {
      "M": [
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086065532-3",
    "name": "Quạt gỗ",
    "shortName": "QG",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 19000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "QG-4",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_QG-4_59.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {
      "M": 5
    },
    "sizeColorVariants": {
      "M": [
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086065532-4",
    "name": "Quạt gỗ",
    "shortName": "QG",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 19000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "QG-5",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_QG-5_60.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {
      "M": 5
    },
    "sizeColorVariants": {
      "M": [
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "name": "Kiềng (Size S)",
    "shortName": "Kiềng",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 70000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Kiềng-S-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_Ki_ng-S-1_61.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Trắng tinh khôi",
      "M": "Trắng tinh khôi"
    },
    "sizeQtyMap": {
      "S": 2,
      "M": 2
    },
    "sizeColorVariants": {
      "S": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ],
      "M": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ]
    },
    "color": "Trắng tinh khôi",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793086187350-0"
  },
  {
    "name": "Kiềng (Size S)",
    "shortName": "Kiềng",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 70000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Kiềng-S-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_Ki_ng-S-2_62.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Trắng tinh khôi",
      "M": "Trắng tinh khôi"
    },
    "sizeQtyMap": {
      "S": 2,
      "M": 2
    },
    "sizeColorVariants": {
      "S": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ],
      "M": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ]
    },
    "color": "Trắng tinh khôi",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793086187350-1"
  },
  {
    "name": "Kiềng (Size M)",
    "shortName": "Kiềng",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 70000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Kiềng-M-1",
    "description": "",
    "image": "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Trắng tinh khôi",
      "M": "Trắng tinh khôi"
    },
    "sizeQtyMap": {
      "S": 2,
      "M": 2
    },
    "sizeColorVariants": {
      "S": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ],
      "M": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ]
    },
    "color": "Trắng tinh khôi",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793086187350-2"
  },
  {
    "name": "Kiềng (Size M)",
    "shortName": "Kiềng",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 70000,
    "dailyRate": 20000,
    "price1Day": 20000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Kiềng-M-2",
    "description": "",
    "image": "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Trắng tinh khôi",
      "M": "Trắng tinh khôi"
    },
    "sizeQtyMap": {
      "S": 2,
      "M": 2
    },
    "sizeColorVariants": {
      "S": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ],
      "M": [
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ]
    },
    "color": "Trắng tinh khôi",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793086187350-3"
  },
  {
    "id": "outfit-1793086261848-0",
    "name": "Trâm cài",
    "shortName": "Trâm cài",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 30000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Trâm cài-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_Tr_m_c_i-1_65.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đỏ đô"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Đỏ đô",
        "Hồng phấn",
        "xanh lá",
        "Be sữa"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086261849-1",
    "name": "Trâm cài",
    "shortName": "Trâm cài",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 30000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Trâm cài-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_Tr_m_c_i-2_66.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đỏ đô"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Đỏ đô",
        "Hồng phấn",
        "xanh lá",
        "Be sữa"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086261849-2",
    "name": "Trâm cài",
    "shortName": "Trâm cài",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 30000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Trâm cài-3",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_Tr_m_c_i-3_67.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đỏ đô"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Đỏ đô",
        "Hồng phấn",
        "xanh lá",
        "Be sữa"
      ]
    },
    "color": "xanh lá",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086261849-3",
    "name": "Trâm cài",
    "shortName": "Trâm cài",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 30000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Trâm cài-4",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_Tr_m_c_i-4_68.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đỏ đô"
    },
    "sizeQtyMap": {
      "M": 4
    },
    "sizeColorVariants": {
      "M": [
        "Đỏ đô",
        "Hồng phấn",
        "xanh lá",
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086346793-0",
    "name": "vòng ngọc trai",
    "shortName": "vòng ngọc trai",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 40000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "vòng ngọc trai-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_v_ng_ng_c_trai-1_69.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Trắng tinh khôi"
    },
    "sizeQtyMap": {
      "M": 3
    },
    "sizeColorVariants": {
      "M": [
        "Trắng tinh khôi",
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ]
    },
    "color": "Trắng tinh khôi",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086346793-1",
    "name": "vòng ngọc trai",
    "shortName": "vòng ngọc trai",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 40000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "vòng ngọc trai-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_v_ng_ng_c_trai-2_70.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Trắng tinh khôi"
    },
    "sizeQtyMap": {
      "M": 3
    },
    "sizeColorVariants": {
      "M": [
        "Trắng tinh khôi",
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ]
    },
    "color": "Trắng tinh khôi",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086346793-2",
    "name": "vòng ngọc trai",
    "shortName": "vòng ngọc trai",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 40000,
    "dailyRate": 10000,
    "price1Day": 10000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "vòng ngọc trai-3",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_v_ng_ng_c_trai-3_71.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Trắng tinh khôi"
    },
    "sizeQtyMap": {
      "M": 3
    },
    "sizeColorVariants": {
      "M": [
        "Trắng tinh khôi",
        "Trắng tinh khôi",
        "Trắng tinh khôi"
      ]
    },
    "color": "Trắng tinh khôi",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086394043-0",
    "name": "nón (Size M)",
    "shortName": "nón-1",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 100000,
    "dailyRate": 30000,
    "price1Day": 30000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "nón-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_n_n-1_72.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đỏ đô"
    },
    "sizeQtyMap": {
      "M": 2
    },
    "sizeColorVariants": {
      "M": [
        "Đỏ đô",
        "Be sữa"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793086394044-1",
    "name": "nón (Size M)",
    "shortName": "nón-2",
    "category": "Phụ kiện",
    "isPrinter": false,
    "purchasePrice": 100000,
    "dailyRate": 30000,
    "price1Day": 30000,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "nón-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_n_n-2_73.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-rec-1793088059758-0",
    "name": "túi đen 1 quai",
    "shortName": "túi đen 1 quai",
    "serialNumber": "túi đen 1 quai",
    "category": "Phụ kiện",
    "size": "Freesize",
    "availableSizes": [
      "Freesize"
    ],
    "color": "",
    "gender": "Nữ",
    "status": "Available",
    "cleaningStatus": "Clean",
    "purchasePrice": 90000,
    "dailyRate": 30000,
    "price1Day": 30000,
    "price2Days": 10000,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 150000,
    "image": "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600",
    "description": "Trang phục túi đen 1 quai (Mã tag túi đen 1 quai)"
  },
  {
    "id": "outfit-rec-1793088059758-1",
    "name": "Túi dây xích",
    "shortName": "túi dây xích",
    "serialNumber": "túi dây xích",
    "category": "Phụ kiện",
    "size": "Freesize",
    "availableSizes": [
      "Freesize"
    ],
    "color": "",
    "gender": "Nữ",
    "status": "Available",
    "cleaningStatus": "Clean",
    "purchasePrice": 169000,
    "dailyRate": 40000,
    "price1Day": 40000,
    "price2Days": 20000,
    "price3Days": 10000,
    "price4DaysPlus": 0,
    "depositAmount": 250000,
    "image": "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=600",
    "description": "Trang phục Túi dây xích (Mã tag túi dây xích)"
  },
  {
    "id": "outfit-rec-1793088059758-2",
    "name": "túi hình hoa (Freesize)",
    "shortName": "túi hình hoa-2",
    "serialNumber": "túi hình hoa-2",
    "category": "Phụ kiện",
    "size": "Freesize",
    "availableSizes": [
      "Freesize"
    ],
    "color": "Hồng phấn",
    "gender": "Nữ",
    "status": "Available",
    "cleaningStatus": "Clean",
    "purchasePrice": 160000,
    "dailyRate": 40000,
    "price1Day": 40000,
    "price2Days": 20000,
    "price3Days": 10000,
    "price4DaysPlus": 0,
    "depositAmount": 250000,
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_t_i_h_nh_hoa-2_76.jpg",
    "description": "Trang phục túi hình hoa (Mã tag túi hình hoa-2)",
    "isPrinter": false,
    "selectedSizes": [
      "Freesize"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "Freesize": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "Freesize": [
        "Hồng phấn"
      ]
    },
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 40000,
    "printPrice3To9": 35000,
    "printPrice10Plus": 33000
  },
  {
    "id": "outfit-rec-1793088059758-3",
    "name": "túi hình hoa (Freesize)",
    "shortName": "túi hình hoa-1",
    "serialNumber": "túi hình hoa-1",
    "category": "Phụ kiện",
    "size": "Freesize",
    "availableSizes": [
      "Freesize"
    ],
    "color": "Be sữa",
    "gender": "Nữ",
    "status": "Available",
    "cleaningStatus": "Clean",
    "purchasePrice": 160000,
    "dailyRate": 40000,
    "price1Day": 40000,
    "price2Days": 20000,
    "price3Days": 10000,
    "price4DaysPlus": 0,
    "depositAmount": 250000,
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_t_i_h_nh_hoa-1_77.jpg",
    "description": "Trang phục túi hình hoa (Mã tag túi hình hoa-1)",
    "isPrinter": false,
    "selectedSizes": [
      "Freesize"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "Freesize": "Be sữa"
    },
    "sizeQtyMap": {
      "Freesize": 2
    },
    "sizeColorVariants": {
      "Freesize": [
        "Be sữa",
        "Hồng phấn"
      ]
    },
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 40000,
    "printPrice3To9": 35000,
    "printPrice10Plus": 33000
  },
  {
    "name": "Áo dài cam quần ren (Size M)",
    "shortName": "AD CQR",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 450000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CQR",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CQR_78.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "cam",
      "M": "cam"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "cam",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793091642009-0"
  },
  {
    "id": "outfit-1793091875297-0",
    "name": "Áo dài cổ tròn xanh chấm bi (Size M)",
    "shortName": "AD CTXCB",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 380000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CTXCB",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CTXCB_79.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "xanh lá"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "xanh lá",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793092086095-0",
    "name": "Áo dài tơ ngoài cài hoa dài",
    "shortName": "AD TNCHD",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 400000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TNCHD",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TNCHD_80.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Xanh pastel",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Xanh pastel"
      ]
    },
    "color": "Xanh pastel",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793092172290-0",
    "name": "Áo dài tay ren tím hồng",
    "shortName": "AD TRTH",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 450000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TRTH",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TRTH_81.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Tím hồng",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Tím hồng"
      ]
    },
    "color": "Tím hồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793092286984-0",
    "name": "Áo dài tứ thân 4 cúc ren",
    "shortName": "AD TT4CR",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 430000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TT4CR",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TT4CR_82.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Vàng đồng"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Vàng đồng"
      ]
    },
    "color": "Vàng đồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793092445591-0",
    "name": "Áo dài tơ choàng xanh hồng",
    "shortName": "AD TCXH",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 550000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TCXH",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TCXH_83.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Xanh Hồng",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Xanh Hồng"
      ]
    },
    "color": "Xanh Hồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793092645729-0",
    "name": "Áo dài cổ tròn vàng ánh kim (Size M)",
    "shortName": "AD CTVAK",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 440000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CTVAK",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CTVAK_84.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Vàng đồng"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "Vàng đồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793092808674-0",
    "name": "Áo dài choàng tơ khuya giữa (Size M)",
    "shortName": "AD CTKG",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 330000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CTKG",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CTKG_85.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {},
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793093242987-0",
    "name": "Áo dài đỏ cổ tròn 2 khuy",
    "shortName": "AD ĐCT2K",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 440000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD ĐCT2K",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD__CT2K_86.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Đỏ đô",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Đỏ đô"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793093391035-0",
    "name": "Yếm ngọc trai",
    "shortName": "YNT",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 330000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "YNT",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_YNT_87.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Hồng phấn"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Hồng phấn"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793093538329-0",
    "name": "Áo dài tơ choàng 3 khuy giữa",
    "shortName": "AD TC3KG",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 420000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TC3KG",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TC3KG_88.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "name": "Áo dài cổ tròn  (Size S)",
    "shortName": "AD CT",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 380000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CT-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CT-S_89.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "xanh nhạt quần hồng",
      "M": "xanh đậm quần nâu"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "xanh nhạt quần hồng"
      ],
      "M": [
        "xanh đậm quần nâu"
      ]
    },
    "color": "xanh nhạt quần hồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793093917617-0"
  },
  {
    "name": "Áo dài cổ tròn  (Size M)",
    "shortName": "AD CT",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 380000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CT-M",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CT-M_90.jpg",
    "size": "M",
    "selectedSizes": [
      "S",
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "xanh nhạt quần hồng",
      "M": "xanh đậm quần nâu"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "xanh nhạt quần hồng"
      ],
      "M": [
        "xanh đậm quần nâu"
      ]
    },
    "color": "xanh đậm quần nâu",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ],
    "id": "outfit-1793093917617-1"
  },
  {
    "id": "outfit-1793094018143-0",
    "name": "Áo dài tứ thân 3 cúc",
    "shortName": "AD TT3C",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 480000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TT3C",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TT3C_91.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Xanh lá",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Xanh lá"
      ]
    },
    "color": "Xanh lá",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793094384829-0",
    "name": "Áo dài cổ tròm 3 khuy xanh nhạt",
    "shortName": "AD CT3KXN",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 550000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CT3KXN",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CT3KXN_92.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Xanh nhạt",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Xanh nhạt"
      ]
    },
    "color": "Xanh nhạt",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793094493348-0",
    "name": "Áo dài giọt nước",
    "shortName": "AD GN",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 300000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD GN",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_GN_93.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Xanh pastel",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Xanh pastel"
      ]
    },
    "color": "Xanh pastel",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793094585769-0",
    "name": "Yếm đỏ có choàng",
    "shortName": "Y ĐCC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 340000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Y ĐCC",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_Y__CC_94.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Đỏ đô",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Đỏ đô"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793094748847-0",
    "name": "Áo dài cổ tròn óng ánh",
    "shortName": "AD CTOA",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 340000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CTOA",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CTOA_95.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Đỏ đô"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Đỏ đô"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793094845870-0",
    "name": "Áo đỏ cổ tròn xanh",
    "shortName": "AĐ CTX",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 340000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AĐ CTX",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_A__CTX_96.jpg",
    "size": "L",
    "selectedSizes": [
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "L": "Đỏ đô",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "L": [
        "Đỏ đô"
      ]
    },
    "color": "Đỏ đô",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ]
  },
  {
    "id": "outfit-1793094935752-0",
    "name": "Yếm có choàng",
    "shortName": "YCC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 300000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "YCC",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_YCC_97.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Be sữa",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793095350877-0",
    "name": "Áo dài tứ thân ren 4 cúc",
    "shortName": "AD TTR4C",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 430000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TTR4C",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TTR4C_98.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Xanh pastel"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Xanh pastel"
      ]
    },
    "color": "Xanh pastel",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793095479102-0",
    "name": "Áo dài cổ tròn 2 khuy",
    "shortName": "AD CT2K",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 440000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD CT2K",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_CT2K_99.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Hồng phấn",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Hồng phấn"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  },
  {
    "id": "outfit-1793095591210-0",
    "name": "Áo dài giọt nước",
    "shortName": "Áo dài giọt nước",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 300000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "Áo dài giọt nước",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam__o_d_i_gi_t_n__c_100.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Be sữa"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "M": [
        "Be sữa"
      ]
    },
    "color": "Be sữa",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "name": "Áo dài ren hồng đồng (Size S)",
    "shortName": "AD RHĐ",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 430000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD RHĐ-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_RH_-S_101.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Hồng đồng",
      "M": "",
      "L": "Hồng đồng"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Hồng đồng"
      ],
      "L": [
        "Hồng đồng"
      ]
    },
    "color": "Hồng đồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793095702217-0"
  },
  {
    "name": "Áo dài ren hồng đồng (Size L)",
    "shortName": "AD RHĐ",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 430000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD RHĐ-L",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_RH_-L_102.jpg",
    "size": "L",
    "selectedSizes": [
      "S",
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Hồng đồng",
      "M": "",
      "L": "Hồng đồng"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Hồng đồng"
      ],
      "L": [
        "Hồng đồng"
      ]
    },
    "color": "Hồng đồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ],
    "id": "outfit-1793095702218-1"
  },
  {
    "name": "Áo dài tơ choàng cài hoa dài (Size S)",
    "shortName": "AD TCCHD",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 520000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TCCHD-S",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TCCHD-S_103.jpg",
    "size": "S",
    "selectedSizes": [
      "S",
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Hồng phấn",
      "M": "",
      "L": "Vàng đồng"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Hồng phấn"
      ],
      "L": [
        "Vàng đồng"
      ]
    },
    "color": "Hồng phấn",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ],
    "id": "outfit-1793095824335-0"
  },
  {
    "name": "Áo dài tơ choàng cài hoa dài (Size L)",
    "shortName": "AD TCCHD",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 520000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TCCHD-L",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TCCHD-L_104.jpg",
    "size": "L",
    "selectedSizes": [
      "S",
      "L"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "Hồng phấn",
      "M": "",
      "L": "Vàng đồng"
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "Hồng phấn"
      ],
      "L": [
        "Vàng đồng"
      ]
    },
    "color": "Vàng đồng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "L"
    ],
    "id": "outfit-1793095824336-1"
  },
  {
    "id": "outfit-1793099857625-0",
    "name": "Áo dài tứ thân nhiều cúc",
    "shortName": "AD TTNC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 450000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TTNC-1",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TTNC-1_105.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Xanh lá nhạt"
    },
    "sizeQtyMap": {
      "M": 2
    },
    "sizeColorVariants": {
      "M": [
        "Xanh lá nhạt",
        "Xanh lá đậm"
      ]
    },
    "color": "Xanh lá nhạt",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793099857625-1",
    "name": "Áo dài tứ thân nhiều cúc",
    "shortName": "AD TTNC",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 450000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TTNC-2",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TTNC-2_106.jpg",
    "size": "M",
    "selectedSizes": [
      "M"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "M": "Xanh lá nhạt"
    },
    "sizeQtyMap": {
      "M": 2
    },
    "sizeColorVariants": {
      "M": [
        "Xanh lá nhạt",
        "Xanh lá đậm"
      ]
    },
    "color": "Xanh lá đậm",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "M"
    ]
  },
  {
    "id": "outfit-1793099935662-0",
    "name": "Áo dài tứ thân xanh ánh vàng",
    "shortName": "AD TTXAV",
    "category": "Áo dài",
    "isPrinter": false,
    "purchasePrice": 450000,
    "dailyRate": 0,
    "price1Day": 0,
    "price2Days": 0,
    "price3Days": 0,
    "price4DaysPlus": 0,
    "depositAmount": 0,
    "status": "Available",
    "serialNumber": "AD TTXAV",
    "description": "",
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_AD_TTXAV_107.jpg",
    "size": "S",
    "selectedSizes": [
      "S"
    ],
    "splitBySize": false,
    "sizeColorMap": {
      "S": "xanh ánh vàng",
      "M": ""
    },
    "sizeQtyMap": {},
    "sizeColorVariants": {
      "S": [
        "xanh ánh vàng"
      ]
    },
    "color": "xanh ánh vàng",
    "gender": "Nữ",
    "cleaningStatus": "Clean",
    "measurements": "",
    "includedAccessories": "",
    "brand": "Ngọc Anh",
    "type": "",
    "printPrice1To2": 0,
    "printPrice3To9": 0,
    "printPrice10Plus": 0,
    "availableSizes": [
      "S"
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Nguyễn Thị Thu Hà',
    phone: '0982647900',
    email: 'thuha.photo@gmail.com',
    address: 'Q. Cầu Giấy, Hà Nội',
    idNumber: '001198004567',
    trustLevel: 'High',
    rentalCount: 3,
    totalSpent: 1650000,
    notes: 'Khách hàng thân thiết, giữ gìn trang phục rất sạch sẽ và trả đồ đúng giờ.',
    createdAt: '2026-01-15'
  },
  {
    id: 'cust-2',
    name: 'Trần Văn Hoàng',
    phone: '0912445889',
    email: 'hoangtran.art@gmail.com',
    address: 'Q. Đống Đa, Hà Nội',
    idNumber: '001095012389',
    trustLevel: 'High',
    rentalCount: 2,
    totalSpent: 950000,
    notes: 'Thuê set hán phục cổ trang chụp ảnh ngoại cảnh.',
    createdAt: '2026-02-10'
  },
  {
    id: 'cust-3',
    name: 'Lê Mai Anh',
    phone: '0978332115',
    email: 'maianh.event@gmail.com',
    address: 'Q. Hai Bà Trưng, Hà Nội',
    idNumber: '034199008765',
    trustLevel: 'Medium',
    rentalCount: 1,
    totalSpent: 320000,
    notes: 'Thuê đầm dạ hội đi tiệc cuối năm công ty.',
    createdAt: '2026-03-05'
  }
];

export const INITIAL_CONTRACTS: RentalContract[] = [
  {
    id: 'con-001',
    contractCode: 'HD-2026-001',
    customerId: 'cust-1',
    customerName: 'Nguyễn Thị Thu Hà',
    customerPhone: '0982647900',
    customerDocType: 'CCCD_And_1M',
    customerDocNote: '',
    items: [
      {
        cameraId: 'outfit-1',
        cameraName: 'Áo Dài Cách Tân Dáng Suông Tơ Ánh Kim',
        dailyRate: 250000,
        quantity: 1
      },
      {
        cameraId: 'outfit-9',
        cameraName: 'Combo Phụ Kiện (Mấn + Quạt Cổ Trang + Trang Sức)',
        dailyRate: 80000,
        quantity: 1
      }
    ],
    startDate: '2026-10-08',
    endDate: '2026-10-10',
    totalPrice: 1470000,
    discountPercent: 0,
    paidAmount: 1470000,
    depositAmount: 1000000,
    status: 'Completed',
    note: 'Đã trả đồ đủ phụ kiện mấn và quạt, đồ nguyên vẹn sạch sẽ.',
    createdAt: '2026-10-07T10:00:00Z'
  },
  {
    id: 'con-002',
    contractCode: 'HD-2026-002',
    customerId: 'cust-2',
    customerName: 'Trần Văn Hoàng',
    customerPhone: '0912445889',
    customerDocType: 'CCCD',
    customerDocNote: '',
    items: [
      {
        cameraId: 'outfit-3',
        cameraName: 'Set Cổ Trang Hán Phục Cách Điệu Nữ Tính',
        dailyRate: 250000,
        quantity: 1
      }
    ],
    startDate: '2026-10-10',
    endDate: '2026-10-11',
    totalPrice: 500000,
    discountPercent: 0,
    paidAmount: 500000,
    depositAmount: 0,
    status: 'Active',
    note: 'Khách hẹn trả trước 18:00 ngày 11/10.',
    createdAt: '2026-10-09T14:30:00Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    "id": "exp-outfit-1793040582495-eodlt",
    "description": "Vốn nhập trang phục: Quạt trung quốc (#QTQ-2)",
    "amount": 156000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040582495-aj5jm",
    "description": "Vốn nhập trang phục: Quạt trung quốc (#QTQ-1)",
    "amount": 156000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040454588-lj6s0",
    "description": "Vốn nhập trang phục: Quạt gỗ (#QG-5)",
    "amount": 95000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040454588-aeole",
    "description": "Vốn nhập trang phục: Quạt gỗ (#QG-4)",
    "amount": 95000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040454588-cn8rn",
    "description": "Vốn nhập trang phục: Quạt gỗ (#QG-3)",
    "amount": 95000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040454588-3e54c",
    "description": "Vốn nhập trang phục: Quạt gỗ (#QG-2)",
    "amount": 95000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040454588-nujly",
    "description": "Vốn nhập trang phục: Quạt gỗ (#QG-1)",
    "amount": 95000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040347919-uldfl",
    "description": "Vốn nhập trang phục: Quạt trung quốc (#QTQ-2)",
    "amount": 156000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040347919-polnm",
    "description": "Vốn nhập trang phục: Quạt trung quốc (#QTQ-1)",
    "amount": 156000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040182237-6o87g",
    "description": "Vốn nhập trang phục: Guốc bạc nơ (#GBN)",
    "amount": 184000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793040079273-q0ms3",
    "description": "Vốn nhập trang phục: Túi xách đeo 1 bên (#TX Đ1B)",
    "amount": 88000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039975958-djnht",
    "description": "Vốn nhập trang phục: Túi đi tiệc (#TĐT)",
    "amount": 222000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039779075-qllkv",
    "description": "Vốn nhập trang phục: Túi xò cầm tay (#TXCT)",
    "amount": 174000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039693196-ak7pj",
    "description": "Vốn nhập trang phục: Túi xách hình hoa (#TXHH-2)",
    "amount": 214000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039693196-ylit0",
    "description": "Vốn nhập trang phục: Túi xách hình hoa (#TXHH-1)",
    "amount": 214000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039580757-d1gzh",
    "description": "Vốn nhập trang phục: Túi thuê hoa (#TTH-4)",
    "amount": 189000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039580757-i99h8",
    "description": "Vốn nhập trang phục: Túi thuê hoa (#TTH-3)",
    "amount": 189000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039580757-o1uhn",
    "description": "Vốn nhập trang phục: Túi thuê hoa (#TTH-2)",
    "amount": 189000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039580756-zonlq",
    "description": "Vốn nhập trang phục: Túi thuê hoa (#TTH-1)",
    "amount": 189000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039452064-wf76q",
    "description": "Vốn nhập trang phục: Guốc quai óng ánh mũi (#GQOAM)",
    "amount": 115000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039318433-7qbmp",
    "description": "Vốn nhập trang phục: Guốc ren nơ (#GRN)",
    "amount": 259000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039218724-5xdyw",
    "description": "Vốn nhập trang phục: Guốc nâu nơ (#GNN)",
    "amount": 173000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793039035121-dp76x",
    "description": "Vốn nhập trang phục: Guốc đen nơ (#GĐN)",
    "amount": 141000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038932109-xf4uo",
    "description": "Vốn nhập trang phục: Guốc mộc (Size M) (#GM-M-2)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038932109-47i5v",
    "description": "Vốn nhập trang phục: Guốc mộc (Size M) (#GM-M-1)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038932109-skhbh",
    "description": "Vốn nhập trang phục: Guốc mộc (Size S) (#GM-S-2)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038932109-xx5dd",
    "description": "Vốn nhập trang phục: Guốc mộc (Size S) (#GM-S-1)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038881455-zgzb1",
    "description": "Vốn nhập trang phục: Váy ngắn cup ngực + áo choàng (Size M) (#VN CNAC-M)",
    "amount": 690000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038881455-g4w1b",
    "description": "Vốn nhập trang phục: Váy ngắn cup ngực + áo choàng (Size S) (#VN CNAC-S)",
    "amount": 690000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038697353-6bsn0",
    "description": "Vốn nhập trang phục: Guốc mộc (Size L) (#GM-L-2)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038697353-galzu",
    "description": "Vốn nhập trang phục: Guốc mộc (Size L) (#GM-L-1)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038697353-islpf",
    "description": "Vốn nhập trang phục: Guốc mộc (Size M) (#GM-M-2)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038697352-qydnl",
    "description": "Vốn nhập trang phục: Guốc mộc (Size M) (#GM-M-1)",
    "amount": 460000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038518270-zeksb",
    "description": "Vốn nhập trang phục: Váy ngắn cup ngực + áo choàng (Size M) (#VN CNAC-M)",
    "amount": 680000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793038518269-vpium",
    "description": "Vốn nhập trang phục: Váy ngắn cup ngực + áo choàng (Size S) (#VN CNAC-S)",
    "amount": 680000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793037217099-glga9",
    "description": "Vốn nhập trang phục: Váy ngắn dài tay lệch tay (#VN DTLT)",
    "amount": 320000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793037100604-8jbp3",
    "description": "Vốn nhập trang phục: Váy ngắn trễ vai hoa (Size M) (#VN TVH-M)",
    "amount": 290000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793037100604-k297j",
    "description": "Vốn nhập trang phục: Váy ngắn trễ vai hoa (Size S) (#VN TVH-S)",
    "amount": 290000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793036977519-cb1qu",
    "description": "Vốn nhập trang phục: Váy ngắn trễ vai hoa (Size M) (#VN TVH-M)",
    "amount": 290000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793036917001-easf3",
    "description": "Vốn nhập trang phục: Váy ngắn trễ vai hoa (Size M) (#VN TVH-M)",
    "amount": 290000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793036917001-f06t9",
    "description": "Vốn nhập trang phục: Váy ngắn trễ vai hoa (Size S) (#VN TVH-S)",
    "amount": 290000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793036804529-svyo3",
    "description": "Vốn nhập trang phục: Váy ngắn tay dài lệch vai hoa (Size M) (#VN DLVH-M)",
    "amount": 280000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793036804528-00nln",
    "description": "Vốn nhập trang phục: Váy ngắn tay dài lệch vai hoa (Size S) (#VN DLVH-S)",
    "amount": 280000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1793036695575-pw7a1",
    "description": "Vốn nhập trang phục: Váy ngắn lưới cổ ngọc trai (#VN LCNT)",
    "amount": 280000,
    "date": "2026-10-27",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792998642008-sssbs",
    "description": "Vốn nhập trang phục: Váy ngắn chữ A chân hoa (#VN CACH)",
    "amount": 420000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792998117230-ettsg",
    "description": "Vốn nhập trang phục: Set yếm bèo cổ ngọc trai (Size M) (#SYBCNC-M)",
    "amount": 300000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792998117230-rm4rm",
    "description": "Vốn nhập trang phục: Set yếm bèo cổ ngọc trai (Size S) (#SYBCNC-S)",
    "amount": 300000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997919145-j2lcw",
    "description": "Vốn nhập trang phục: Set ngắn đền lồng (Size M) (#SNĐL-M)",
    "amount": 320000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997919145-kvv41",
    "description": "Vốn nhập trang phục: Set ngắn đền lồng (Size S) (#SNĐL-S)",
    "amount": 320000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997812605-emo1t",
    "description": "Vốn nhập trang phục: Áo dài ren choàng (Size M) (#AD RC-M)",
    "amount": 340000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997812605-4milx",
    "description": "Vốn nhập trang phục: Áo dài ren choàng (Size S) (#AD RC-S)",
    "amount": 340000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997637811-spw93",
    "description": "Vốn nhập trang phục: Váy yếm ngắn fomt chữ A (#VY NFCA)",
    "amount": 340000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997463785-a5quk",
    "description": "Vốn nhập trang phục: Váy ngắn cup ngực tay dài (#VN CNTD)",
    "amount": 420000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997297590-dcyy7",
    "description": "Vốn nhập trang phục: Váy ngắn 2 dây choàng (Size M) (#VN 2DCC-M)",
    "amount": 300000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997297590-9ffox",
    "description": "Vốn nhập trang phục: Váy ngắn 2 dây choàng (Size S) (#VN 2DCC-S)",
    "amount": 300000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792997127782-hjmw7",
    "description": "Vốn nhập trang phục: váy ngắn set ren 2 dây có choàng (#VN SR2DCC)",
    "amount": 370000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792996929022-os7tk",
    "description": "Vốn nhập trang phục: Váy dài sát nách hoa (#VD SNH)",
    "amount": 370000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792996817140-iuyip",
    "description": "Vốn nhập trang phục: Váy ngắn 4 nơ (#VN 4N)",
    "amount": 350000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792996691074-jg39b",
    "description": "Vốn nhập trang phục: Váy ngắn 2 dây choàng tay dài (#VN 2DCTD)",
    "amount": 340000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792995989105-exsn2",
    "description": "Vốn nhập trang phục: Áo dài xanh lá 2 tà quần vàng (#AD XL2TQV)",
    "amount": 460000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792995876563-47sp0",
    "description": "Vốn nhập trang phục: áo dài bướm đỏ (#AD BĐ)",
    "amount": 460000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792995512222-84r78",
    "description": "Vốn nhập trang phục: Áo dài tay ren (#AD TR)",
    "amount": 480000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792995191717-2g4f4",
    "description": "Vốn nhập trang phục: Áo dài 3 mảnh yếm (#AD 3MY)",
    "amount": 630000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792995063506-dyk16",
    "description": "Vốn nhập trang phục: Váy dài ren cổ cao khoét lưng (#VD RCCKL)",
    "amount": 750000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792994507003-2oomc",
    "description": "Vốn nhập trang phục: Váy ngắn khoét ngực cài hoa vai (#VN KNCHV)",
    "amount": 630000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792994365897-9l91w",
    "description": "Vốn nhập trang phục: Váy ngắn ren 5 nơ (#VN R5N)",
    "amount": 520000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792994056753-xyybc",
    "description": "Vốn nhập trang phục: Váy ngắn ren trễ vai (#VN RTV)",
    "amount": 490000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792993826219-jt3bw",
    "description": "Vốn nhập trang phục: Đầm cup ngực 2 dây (#ĐCNR2D)",
    "amount": 680000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792993572793-42cjs",
    "description": "Vốn nhập trang phục: Đầm ren xẻ ngực (#ĐR XN)",
    "amount": 750000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792958453082-nwl0e",
    "description": "Vốn nhập trang phục: Váy ngắn cup có choàng (Size L) (#VN CCC-L)",
    "amount": 680000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792958189672-ssymu",
    "description": "Vốn nhập trang phục: Đầm cup nâu khăn choàng (#ĐCNKC)",
    "amount": 480000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792958036152-cz0xv",
    "description": "Vốn nhập trang phục: Đầm lụa xoắn vai (#ĐL XV)",
    "amount": 380000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792957877961-txfv5",
    "description": "Vốn nhập trang phục: Đầm lụa sẻ tà (#ĐL ST)",
    "amount": 420000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792957708442-yqg56",
    "description": "Vốn nhập trang phục: Áo dài hồng tơ choàng khuy tàu (#AD HTCKT)",
    "amount": 490000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792957473817-quolj",
    "description": "Vốn nhập trang phục: Áo dài tơ choàng khuy tàu (#AD TCKT)",
    "amount": 500000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792957263833-1902j",
    "description": "Vốn nhập trang phục: Áo dài 2 lớp tơ thường (#AD 2LTT)",
    "amount": 460000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792957129517-kwffo",
    "description": "Vốn nhập trang phục: Áo dài 2 lớp ren trong (#AD 2LRT)",
    "amount": 460000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792956995707-qkc63",
    "description": "Vốn nhập trang phục: Áo dài 2 lớp ren trong (Size M) (#AD 2LRT-M)",
    "amount": 460000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792956995707-ukh7q",
    "description": "Vốn nhập trang phục: Áo dài 2 lớp ren trong (Size S) (#AD 2LRT-S)",
    "amount": 460000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792956747117-61cjg",
    "description": "Vốn nhập trang phục: Váy ngắn ren hoa (Size M) (#VN RH-M)",
    "amount": 400000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792956747116-ps5na",
    "description": "Vốn nhập trang phục: Váy ngắn ren hoa (Size S) (#VN RH-S)",
    "amount": 400000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792955950792-7u31k",
    "description": "Vốn nhập trang phục: Áo dài 4 tà 2 hoa cài (Size L) (#AD 4T2HC-L)",
    "amount": 444000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792955950792-n5ui3",
    "description": "Vốn nhập trang phục: Áo dài 4 tà 2 hoa cài (Size M) (#AD 4T2HC-M)",
    "amount": 444000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792955950792-baxre",
    "description": "Vốn nhập trang phục: Áo dài 4 tà 2 hoa cài (Size S) (#AD 4T2HC-S)",
    "amount": 444000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792955759260-wqbrv",
    "description": "Vốn nhập trang phục: Áo dài 4 tà 2 hoa cài (#AD 4T2HC-XS)",
    "amount": 440000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792955393125-llqcj",
    "description": "Vốn nhập trang phục: Áo dài tứ thân cài hoa dài (Size L) (#AD THCHD-L)",
    "amount": 520000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792955253785-q2iyu",
    "description": "Vốn nhập trang phục: Áo dài tứ thân cài hoa dài (Size L) (#AD THCHD-L)",
    "amount": 520000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792955209753-hayki",
    "description": "Vốn nhập trang phục: Áo dài tứ thân cài hoa dài (Size L) (#AD THCHD-L)",
    "amount": 520000,
    "date": "2026-10-26",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792946606924-x8iku",
    "description": "Vốn nhập trang phục: Áo dài tứ thân ánh vàng (#AD TTAV)",
    "amount": 450000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792946522798-tgn04",
    "description": "Vốn nhập trang phục: Áo dài tứ thân nhiều cúc (#AD TTNC)",
    "amount": 450000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792946454856-3q28k",
    "description": "Vốn nhập trang phục: Áo dài tứ thân  nhiều cúc  (#AD THNC)",
    "amount": 450000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792946312567-jc32a",
    "description": "Vốn nhập trang phục: Áo dài tứ thân cài hoa dài (Size L) (#AD THCHD-L)",
    "amount": 520000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792946312567-qtqx0",
    "description": "Vốn nhập trang phục: Áo dài tứ thân cài hoa dài (Size S) (#AD THCHD-S)",
    "amount": 520000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945790774-apwso",
    "description": "Vốn nhập trang phục: Áo dài 4 tà ánh kim lót ren (Size L) (#AD 4TAKLR-L)",
    "amount": 450000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945790774-wnia8",
    "description": "Vốn nhập trang phục: Áo dài 4 tà ánh kim lót ren (Size S) (#AD 4TAKLR-S)",
    "amount": 450000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945622423-vx6jp",
    "description": "Vốn nhập trang phục: Áo dài cổ tròn khoét giọt nước (Size M) (#AD CTKGN-M)",
    "amount": 300000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945545070-xob4v",
    "description": "Vốn nhập trang phục: Áo dài 4 tà 2 hoa cài (#AD 4T2HC)",
    "amount": 440000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945415495-r5v4p",
    "description": "Vốn nhập trang phục: Áo dài 4 tà 2 hoa cài (Size M) (#AD 4T2HC-M)",
    "amount": 440000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945333370-f0hcn",
    "description": "Vốn nhập trang phục: Áo dài tứ thân lót ren xanh (#AD TTLRX)",
    "amount": 430000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945210519-9k33o",
    "description": "Vốn nhập trang phục: Yếm có khắn choàng (#YCKC)",
    "amount": 300000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792945099732-si6i1",
    "description": "Vốn nhập trang phục: Áo dài 5 cúc xanh (#AD 5CX)",
    "amount": 340000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944985505-0at9k",
    "description": "Vốn nhập trang phục: Áo dài tằm cổ kết (#AD TCK)",
    "amount": 340000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944908854-uzlty",
    "description": "Vốn nhập trang phục: Yếm kèm  choàng rời (#YKCR)",
    "amount": 340000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944821993-zzim5",
    "description": "Vốn nhập trang phục: Áo dài cổ tròn khoét giọt nước  (#AD CTKGN)",
    "amount": 300000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944700258-thfnm",
    "description": "Vốn nhập trang phục: Áo dài choàng yếm 3 cúc (#AD CY3C)",
    "amount": 550000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944611261-b6yd7",
    "description": "Vốn nhập trang phục: Áo dài choàng yếm 3 cúc (#AD CY3C)",
    "amount": 480000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944333973-47cvy",
    "description": "Vốn nhập trang phục: Áo dài cổ tròn 2 tà (Size M) (#AD CT2T-M)",
    "amount": 380000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944333973-pxnki",
    "description": "Vốn nhập trang phục: Áo dài cổ tròn 2 tà (Size S) (#AD CT2T-S)",
    "amount": 380000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944178917-k18w4",
    "description": "Vốn nhập trang phục: Áo dài tứ thân  3 cúc (#AD TT3C)",
    "amount": 420000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792944052929-k14pt",
    "description": "Vốn nhập trang phục: Yếm choàng cổ ngọc trai (#YC CNC)",
    "amount": 330000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792943880375-ktvax",
    "description": "Vốn nhập trang phục: Áo dài 4 tà 2 hoa cài (Size L) (#AD 4T2HC-L)",
    "amount": 440000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792943593355-6llmq",
    "description": "Vốn nhập trang phục: Áo dài tơ tứ thân dây bướm (#AD TTDB)",
    "amount": 330000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792943368340-9j4bc",
    "description": "Vốn nhập trang phục: Áo dài vàng đổ quần xanh (#AD VĐQX)",
    "amount": 440000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792943247741-aa1sh",
    "description": "Vốn nhập trang phục: Áo dài tơ xanh phối hồng (#AD TXPH)",
    "amount": 550000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792943143492-4391j",
    "description": "Vốn nhập trang phục: Áo dài tứ thân lót ren (#AD TTLR)",
    "amount": 430000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792943059017-b5oid",
    "description": "Vốn nhập trang phục: Áo dài tay ren (#AD TR)",
    "amount": 450000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792942934279-rbjak",
    "description": "Vốn nhập trang phục: Áo dài tơ dây hoa (#AD TDH)",
    "amount": 400000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792942783197-yeoul",
    "description": "Vốn nhập trang phục: Áo dài cổ tròn chấm bi  (#AD CTCB)",
    "amount": 380000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792942663247-1j97c",
    "description": "Vốn nhập trang phục: Áo dài cam quần ren cam (#AD QRC)",
    "amount": 450000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792942332448-pebok",
    "description": "Vốn nhập trang phục: Váy dài voan cô dâu (#VN VCD)",
    "amount": 950000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792942255046-hwb4r",
    "description": "Vốn nhập trang phục: Váy ngắn cổ sen nhiều cúc (#VN CSNC)",
    "amount": 480000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792942081524-ltc5q",
    "description": "Vốn nhập trang phục: Váy ngắn ngực ren (Size M) (#VN NR-M)",
    "amount": 480000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792942081524-k0iiu",
    "description": "Vốn nhập trang phục: Váy ngắn ngực ren (Size S) (#VN NR-S)",
    "amount": 480000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941997949-3pv4h",
    "description": "Vốn nhập trang phục: Váy ngắn cup có choàng (Size L) (#VN CCC-L)",
    "amount": 680000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941997949-9p6gl",
    "description": "Vốn nhập trang phục: Váy ngắn cup có choàng (Size S) (#VN CCC-S)",
    "amount": 680000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941895801-v8bck",
    "description": "Vốn nhập trang phục: Váy ngắn ren tay dài (#VN RTD)",
    "amount": 580000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941756659-gz1nr",
    "description": "Vốn nhập trang phục: Váy dài 2 dây có choàng  (#VD 2DCC)",
    "amount": 890000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941695850-dq32m",
    "description": "Vốn nhập trang phục: Váy ngắn chân ren có nơ (Size M) (#VN CRCN-M)",
    "amount": 550000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941695850-zf09a",
    "description": "Vốn nhập trang phục: Váy ngắn chân ren có nơ (Size S) (#VN CRCN-S)",
    "amount": 550000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941493025-kmto4",
    "description": "Vốn nhập trang phục: Váy dài trễ vai có choàng tay (#VD TVCC)",
    "amount": 780000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792941383717-0jffo",
    "description": "Vốn nhập trang phục: Váy dài lệch tay tay dài (#VD ĐTD)",
    "amount": 680000,
    "date": "2026-10-25",
    "category": "Equipment",
    "operator": "Quản trị viên"
  },
  {
    "id": "exp-outfit-1792810452923-99khu",
    "description": "Vốn nhập trang phục: Váy ngắn ren hoa (Size L) (#VC-L)",
    "amount": 400000,
    "date": "2026-10-24",
    "category": "Equipment",
    "operator": "Quản trị viên"
  }
];

export const loadStoredData = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`camlease_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
    return defaultValue;
  }
};

export const saveStoredData = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(`camlease_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
};

export const cleanSystemNote = (note?: string): string => {
  if (!note) return '';
  return note.replace(/\s*\[Hệ thống[^\]]*\]/g, '').trim();
};
