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
    "image": "https://efiadllfvhsqhditgewd.supabase.co/storage/v1/object/public/outfits/cam_VN_CN_AC_M_0.jpg",
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
