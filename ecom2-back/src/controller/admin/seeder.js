const Brand = require('../../models/brand')
const Category = require('../../models/category')
const Product = require('../../models/product')
const Attribute = require('../../models/attribute')
const User = require('../../models/user')

exports.resetData=async(req,res)=>{
    try {
        await Brand.deleteMany().exec()
        await Product.deleteMany().exec()
        await Category.deleteMany().exec()
        await Attribute.deleteMany().exec()
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error);
        res.status(404).json({error:"something went wrong"})
    }
}


let brandData =[
    {
        "_id":"608c7ae427be2cba1ca96f9a",
        "status": true,
        "name": "Easy",
        "slug": "Easy-78dC87JOYJ",
        "image": "https://res.cloudinary.com/shimul/image/upload/v1614761599/logo-footer-main-1-1_l8ypig.png",
      },{
        "_id":"608c7ae427be2cba1ca96f9b",
        "status": true,
        "name": "One plus",
        "slug": "One-plus-40IfKFw6Pk",
        "image": "https://res.cloudinary.com/shimul/image/upload/v1617788896/8BzoH98Kc-OnePlus-Logo-Old.jpg",
      },{
        "_id":"608c7ae427be2cba1ca96f9c",
        "status": true,
        "name": "Xiaomi",
        "slug": "Xiaomi-snigHY8U5h",
        "image": "https://res.cloudinary.com/shimul/image/upload/v1617824749/2xB1zxf81-download.jpg",
      },{
        "_id": "60924adc71cc3dd0ef2edbd2",
        "status": true,
        "name": "samsung",
        "slug": "samsung-gCdA9EvKh",
        "image": "",
      }
]

let productData=[
    {
        "discount": {
          "discountType": "percent",
          "value": 10
        },
        "tax": {
          "taxType": "flat",
          "value": 10
        },
        "shipping": {
          "cost":30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "Mobile"
        ],
        "gallery": [
          
        ],
        "attributes": [
          {
            "name": "Ram",
            "values": [
              "4",
              "6"
            ]
          },
          {
            "name": "Rom",
            "values": [
              "64",
              "128"
            ]
          }
        ],
        "variations": [
          {
            "stock": 7,
            "image": "",
            "price": "20000",
            "discount": 0,
            "discountType": "flat",
            "isDefault": true,
            "Ram": "4",
            "Rom": "64",
            "varname": "4--64"
          },
          {
            "stock": "20",
            "image": "",
            "price": "25000",
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "Ram": "6",
            "Rom": "64",
            "varname": "6--64"
          },
          {
            "stock": 29,
            "image": "",
            "price": "20000",
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "Ram": "4",
            "Rom": "128",
            "varname": "4--128"
          },
          {
            "stock": 0,
            "image": "",
            "price": "25000",
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "Ram": "6",
            "Rom": "128",
            "varname": "6--128"
          }
        ],
        "productType": "variant",
        "isActive": true,
        "isFeatured": true,
        "sales": 4,
        "_id": "608c865927be2cba1ca96faa",
        "name": "Demo mobile",
        "slug": "Demo-mobile-QZSzzj1cJ",
        "categories": [
          {
            "_id": "608fa8f90d364cc4e5878c0a",
            "level": 1,
            "category":"608c787927be2cba1ca96f76"
          },
          {
            "_id": "608fa8f90d364cc4e5878c0b",
            "level": 2,
            "category":"608c793f27be2cba1ca96f82"
          },
          {
            "_id": "608fa8f90d364cc4e5878c0c",
            "level": 3,
            "category":  "608c798f27be2cba1ca96f87"
          }
        ],
        "brand": "608c7ae427be2cba1ca96f9c",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1617901875/4BomcFvwl-xiaomi-mi-cc9-pro-4.jpg",
        "price": 20000,
        "sku": "",
        "stock": 56,
        "description": "",
        "unit": "Pc",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "percent",
          "value": 10
        },
        "tax": {
          "taxType": "flat",
          "value": 10
        },
        "shipping": {
          "cost": 30,
          "isFree": false
        },
        "meta": {
          "title": "this is meta",
          "description": "",
          "image": ""
        },
        "tags": [
          "phone,smart"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1614184938/w8wocdz9sng17biaoldm.jpg"
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 0,
        "_id": "608cf3df67474a2ed8e135a5",
        "name": "first product",
        "slug": "first-product-iVLBi4m2Lv",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1614220169/gqzftyqhk0dzml4jgcck.jpg",
        "categories": [
          {
            "_id": "608d06965c68f037208b338c",
            "level": 1,
            "category":"608c787927be2cba1ca96f76"
          },
          {
            "_id": "608d06965c68f037208b338d",
            "level": 2,
            "category": "608c793f27be2cba1ca96f82"
          },
          {
            "_id": "608d06965c68f037208b338e",
            "level": 3,
            "category":  "608c799827be2cba1ca96f88"
          }
        ],
        "brand": "6034ad3f0e810b16442412d8",
        "price": 200,
        "unit": "pc",
        "sku": "mb01",
        "stock": 0,
        "description": "<p>this is demo description</p>",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "flat",
          "value": 500
        },
        "tax": {
          "taxType": "flat",
          "value": 500
        },
        "shipping": {
          "cost":30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "camera,security,item"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1610732539/xz5rifdkpvu69gxoinxl.jpg",
          "https://res.cloudinary.com/shimul/image/upload/v1609307209/kxt13g7m8jkufhvwqeno.png",
          "https://res.cloudinary.com/shimul/image/upload/v1609083267/oivos1rzeryzlikqvmcq.png"
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 0,
        "_id": "608cf3df67474a2ed8e135a6",
        "name": "Digital Smart Duel Security Safe/Locker",
        "slug": "Digital-Smart-Duel-Security-SafeLocker-aBfXmAjhXe",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1609515359/nkigen6pfeafv8z3wjny.jpg",
        "categories": [
          {
            "_id": "608d1701e956994eac0bec5b",
            "level": 1,
            "category": "608c787927be2cba1ca96f76"
          }
        ],
        "brand": "608c7ae427be2cba1ca96f9a",
        "price": 100,
        "unit": "pc",
        "sku": "50",
        "stock": 0,
        "description": "",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "percent",
          "value": 10
        },
        "tax": {
          "taxType": "flat",
          "value": 10
        },
        "shipping": {
          "cost": 30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "tshirt"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1614620931/9d5e7031446a-13_m84ewx.jpg"
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 0,
        "_id": "608cf3df67474a2ed8e135a7",
        "name": "T-shirt for Men",
        "slug": "T-shirt-for-Men-Ej9gYqvDOv",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1614620906/0723ea693912-t-shirt-4_qfvfrr.png",
        "categories": [
          {
            "_id": "608d692ab44b9928b0f22fca",
            "level": 1,
            "category": "608c78e827be2cba1ca96f7e"
          },
          {
            "_id": "608d692ab44b9928b0f22fcb",
            "level": 2,
            "category":"608c7a3627be2cba1ca96f91"
          }
        ],
        "brand": null,
        "price": 400,
        "unit": "pc",
        "sku": "fdfh",
        "stock": 0,
        "description": "",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "flat",
          "value": 0
        },
        "tax": {
          "taxType": "flat",
          "value": 0
        },
        "shipping": {
          "cost": 30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "pant"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1614621275/4a603d84c2af-black-f-1_pwfkm2.png"
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 0,
        "_id": "608cf3df67474a2ed8e135a8",
        "name": "Chinos Pant For Men",
        "slug": "Chinos-Pant-For-Men-LZ370-XB0M",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1614621232/fcb45f818f2c-5_frkbxm.png",
        "categories": [
          {
            "_id": "608d696eb44b9928b0f22fcc",
            "level": 1,
            "category":"608c78e827be2cba1ca96f7e"
          },
          {
            "_id": "608d696eb44b9928b0f22fcd",
            "level": 2,
            "category": "608c7a4127be2cba1ca96f92"
          }
        ],
        "brand": "603f4e88072b0e356096f696",
        "price": 400,
        "unit": "pc",
        "sku": "pant00",
        "stock": 0,
        "description": "",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "percent",
          "value": 10
        },
        "tax": {
          "taxType": "flat",
          "value": 10
        },
        "shipping": {
          "cost":30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "pant"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1614621232/fcb45f818f2c-5_frkbxm.png"
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 1,
        "_id": "608cf3df67474a2ed8e135a9",
        "name": "Denim Slim Fit Jeans Pant for Men",
        "slug": "Denim-Slim-Fit-Jeans-Pant-for-Men-sQOKq7A0_8",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1614621275/4a603d84c2af-black-f-1_pwfkm2.png",
        "categories": [
          {
            "_id": "608d2348e956994eac0bec66",
            "level": 1,
            "category": "608c78e827be2cba1ca96f7e"
          },
          {
            "_id": "608d2348e956994eac0bec67",
            "level": 2,
            "category": "608c7a4f27be2cba1ca96f94"
          }
        ],
        "brand": "603f4e88072b0e356096f696",
        "price": 120,
        "unit": "pc",
        "sku": "pantde",
        "stock": 29,
        "description": "",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "percent",
          "value": 10
        },
        "tax": {
          "taxType": "flat",
          "value": 10
        },
        "shipping": {
          "cost": 30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "t shirt"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1614620925/0723ea693912-t-shirt-4_o3i45x.png"
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 0,
        "_id": "608cf3df67474a2ed8e135aa",
        "name": "Slim Fit T-shirt",
        "slug": "Slim-Fit-T-shirt-IhXY5SAGQs",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1614620931/9d5e7031446a-13_m84ewx.jpg",
        "categories": [
          {
            "_id": "6090390271cc3dd0ef2edbc5",
            "level": 1,
            "category": "608c78e827be2cba1ca96f7e"
          },
          {
            "_id": "6090390271cc3dd0ef2edbc6",
            "level": 2,
            "category": "608c7a3627be2cba1ca96f91"
          },
        ],
        "brand": "608c7ae427be2cba1ca96f9a",
        "price": 400,
        "unit": "pc",
        "sku": "shhh",
        "stock": 0,
        "description": "",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "percent",
          "value": 10
        },
        "tax": {
          "taxType": "flat",
          "value": 10
        },
        "shipping": {
          "cost":30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "mobile,oneplus"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1617789067/uEFcn4zwp-oneplus.jpg"
        ],
        "attributes": [
          {
            "name": "Ram",
            "values": [
              "4",
              "6"
            ]
          },
          {
            "name": "Rom",
            "values": [
              "64",
              "128"
            ]
          }
        ],
        "variations": [
          {
            "stock": "20",
            "image": "",
            "price": "50000",
            "discount": "10",
            "discountType": "percent",
            "isDefault": true,
            "Ram": "4",
            "Rom": "64",
            "varname": "4--64"
          },
          {
            "stock": "30",
            "image": "https://res.cloudinary.com/shimul/image/upload/v1617789067/uEFcn4zwp-oneplus.jpg",
            "price": "55000",
            "discount": "3000",
            "discountType": "flat",
            "isDefault": false,
            "Ram": "6",
            "Rom": "64",
            "varname": "6--64"
          },
          {
            "stock": 0,
            "image": "",
            "price": "50000",
            "discount": "10",
            "discountType": "percent",
            "isDefault": false,
            "Ram": "4",
            "Rom": "128",
            "varname": "4--128"
          },
          {
            "stock": "10",
            "image": "",
            "price": "55000",
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "Ram": "6",
            "Rom": "128",
            "varname": "6--128"
          }
        ],
        "productType": "variant",
        "isActive": true,
        "isFeatured": true,
        "sales": 0,
        "_id": "608cf3df67474a2ed8e135ab",
        "name": "One plus 8 pro",
        "slug": "One-plus-8-pro-glWNvLcS5q",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1617789075/6-fOj3XZh-OnePlus-8-1.jpg",
        "categories": [
          {
            "_id": "609028d871cc3dd0ef2edbc1",
            "level": 1,
            "category":  "608c787927be2cba1ca96f76"
          },
          {
            "_id": "609028d871cc3dd0ef2edbc2",
            "level": 2,
            "category":"608c793f27be2cba1ca96f82"
          },
          {
            "_id": "609028d871cc3dd0ef2edbc3",
            "level": 3,
            "category": "608c79c927be2cba1ca96f8b"
          }
        ],
        "brand": "608c7ae427be2cba1ca96f9b",
        "price": 50000,
        "unit": "pc",
        "sku": "dfzgdg",
        "stock": 60,
        "description": "<p>dfa</p>",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "percent",
          "value": 5
        },
        "tax": {
          "taxType": "flat",
          "value": 5
        },
        "shipping": {
          "cost": 30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "mobile"
        ],
        "gallery": [
          
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 0,
        "_id": "608cf3df67474a2ed8e135ac",
        "name": "Redmi note 10 pro",
        "slug": "Redmi-note-10-pro-AXwFQxTeMz",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1617824885/6G1IUsLAo-xiaomi-mi-cc9-pro-4.jpg",
        "categories": [
          {
            "_id": "60903a0671cc3dd0ef2edbc9",
            "level": 1,
            "category":  "608c787927be2cba1ca96f76"
          },
          {
            "_id": "60903a0671cc3dd0ef2edbca",
            "level": 2,
            "category":"608c793f27be2cba1ca96f82"
          },
          {
            "_id": "60903a0671cc3dd0ef2edbcb",
            "level": 3,
            "category": "608c798f27be2cba1ca96f87"
          }
        ],
        "brand": "608c7ae427be2cba1ca96f9c",
        "price": 25000,
        "unit": "pc",
        "sku": "",
        "stock": 0,
        "description": "<p>this is a sample product</p>",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "flat",
          "value": 0
        },
        "tax": {
          "taxType": "flat",
          "value": 0
        },
        "shipping": {
          "cost":30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": ""
        },
        "tags": [
          "sample"
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1615925506/Brands/9d5e7031446a-13.jpg.png"
        ],
        "attributes": [
          
        ],
        "variations": [
          
        ],
        "productType": "simple",
        "isActive": true,
        "isFeatured": true,
        "sales": 3,
        "_id": "608cf3df67474a2ed8e135ad",
        "name": "sample product",
        "slug": "sample-product-XvspRXewjD",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1617789067/uEFcn4zwp-oneplus.jpg",
        "categories": [
          {
            "_id": "609388f53c005c09dc417469",
            "level": 1,
            "category": "608c787927be2cba1ca96f76"
          },
          {
            "_id": "609388f53c005c09dc41746a",
            "level": 2,
            "category": "608c793f27be2cba1ca96f82"
          },
          {
            "_id": "609388f53c005c09dc41746b",
            "level": 3,
            "category":"608c798f27be2cba1ca96f87"
          }
        ],
        "brand": "608c7ae427be2cba1ca96f9c",
        "price": 3000,
        "unit": "pc",
        "sku": "gh",
        "stock": 97,
        "description": "",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
      {
        "discount": {
          "discountType": "flat",
          "value": 0
        },
        "tax": {
          "taxType": "flat",
          "value": 0
        },
        "shipping": {
          "cost": 30,
          "isFree": false
        },
        "meta": {
          "title": "",
          "description": "",
          "image": "https://res.cloudinary.com/shimul/image/upload/v1619781141/hwvOjAq9V-home-15-img-8.jpg"
        },
        "tags": [
          
        ],
        "gallery": [
          "https://res.cloudinary.com/shimul/image/upload/v1619850456/71n8UpGvK-apple-606761_1920.jpg",
          "https://res.cloudinary.com/shimul/image/upload/v1619780765/gpgdVFk3l-about-us-2-img-2.jpg"
        ],
        "attributes": [
          {
            "name": "color",
            "values": [
              "red",
              "yellow",
              "white"
            ]
          },
          {
            "name": "size",
            "values": [
              "m",
              "xxl"
            ]
          }
        ],
        "variations": [
          {
            "stock": "55",
            "image": "https://res.cloudinary.com/shimul/image/upload/v1619777572/DERdEDiNF-1603957118-winning-products.jpg",
            "price": "45555",
            "discount": 0,
            "discountType": "flat",
            "isDefault": true,
            "color": "red",
            "size": "m",
            "varname": "red--m"
          },
          {
            "stock": 5,
            "image": "",
            "price": "4566",
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "color": "yellow",
            "size": "m",
            "varname": "yellow--m"
          },
          {
            "stock": "67",
            "image": "https://res.cloudinary.com/shimul/image/upload/v1619770722/D75UoJpjq-white.jpg",
            "price": "666",
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "color": "white",
            "size": "m",
            "varname": "white--m"
          },
          {
            "stock": 0,
            "image": "",
            "price": 0,
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "color": "red",
            "size": "xxl",
            "varname": "red--xxl"
          },
          {
            "stock": 0,
            "image": "",
            "price": 0,
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "color": "yellow",
            "size": "xxl",
            "varname": "yellow--xxl"
          },
          {
            "stock": 0,
            "image": "",
            "price": 0,
            "discount": 0,
            "discountType": "flat",
            "isDefault": false,
            "color": "white",
            "size": "xxl",
            "varname": "white--xxl"
          }
        ],
        "productType": "variant",
        "isActive": true,
        "isFeatured": false,
        "sales": 1,
        "_id": "608cfd1e5aed55be91efa5b7",
        "name": "test",
        "slug": "test-BRk4IOU5U",
        "categories": [
          {
            "_id": "608cfd1e5aed55be91efa5b8",
            "level": 1,
            "category":  "608c787927be2cba1ca96f76"
          },
          {
            "_id": "608cfd1e5aed55be91efa5b9",
            "level": 2,
            "category": "608c793f27be2cba1ca96f82"
          },
          {
            "_id": "608cfd1e5aed55be91efa5ba",
            "level": 3,
            "category":"608c798f27be2cba1ca96f87"
          }
        ],
        "brand": "608c7ae427be2cba1ca96f9b",
        "thumbnail": "https://res.cloudinary.com/shimul/image/upload/v1619780765/gpgdVFk3l-about-us-2-img-2.jpg",
        "price": 45555,
        "sku": "",
        "stock": 127,
        "description": "",
        "unit": "pcs",
        "createdBy": "60428e4e69932031b03d3413",
        "campaigns": [],
      },
     
     
]



let categoryData=[
    {
        "order": 0,
        "categoryImage": "",
        "_id": "608c787927be2cba1ca96f76",
        "name": "Electronic Devices",
        "slug": "Electronic-Devices-GQbxezT67",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c788c27be2cba1ca96f77",
        "name": "Electronic Accessories",
        "slug": "Electronic-Accessories-srJVwK7gv",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c789e27be2cba1ca96f78",
        "name": "TV & Home Appliances",
        "slug": "TV-and-Home-Appliances-v3Lj_rdk4",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78ab27be2cba1ca96f79",
        "name": "Health & Beauty",
        "slug": "Health-and-Beauty-Yy0Muk3sQ",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78bb27be2cba1ca96f7a",
        "name": "Babies & Toys",
        "slug": "Babies-and-Toys-tuIU3rapD",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78c627be2cba1ca96f7b",
        "name": "Groceries & Pets",
        "slug": "Groceries-and-Pets-4HqyryuN0",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78d327be2cba1ca96f7c",
        "name": "Home & Lifestyle",
        "slug": "Home-and-Lifestyle-tLRZGpMH9",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78dd27be2cba1ca96f7d",
        "name": "Women's Fashion",
        "slug": "Women's-Fashion-IzJmmCbYt",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78e827be2cba1ca96f7e",
        "name": "Men's Fashion",
        "slug": "Men's-Fashion-dm19xguh1",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78f327be2cba1ca96f7f",
        "name": "Watches & Accessories",
        "slug": "Watches-and-Accessories-GnCmjPe1K",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c78fc27be2cba1ca96f80",
        "name": "Sports & Outdoor",
        "slug": "Sports-and-Outdoor-rdw38K_ud",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c790727be2cba1ca96f81",
        "name": "Automotive & Motorbike",
        "slug": "Automotive-and-Motorbike-qO1wRpklA",
        "createdBy": "60428e4e69932031b03d3413",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c793f27be2cba1ca96f82",
        "name": "Smartphones",
        "slug": "Smartphones-c3lrmPDDV",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c787927be2cba1ca96f76",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c795427be2cba1ca96f83",
        "name": "Feature Phone",
        "slug": "Feature-Phone-vNzhus9dY",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c787927be2cba1ca96f76",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c796427be2cba1ca96f84",
        "name": "Laptops",
        "slug": "Laptops-d3ylR1Ird",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c787927be2cba1ca96f76",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c796c27be2cba1ca96f85",
        "name": "Tablets",
        "slug": "Tablets--4nxxNGwg",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c787927be2cba1ca96f76",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c797d27be2cba1ca96f86",
        "name": "Desktops",
        "slug": "Desktops-4NDB674Pm",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c787927be2cba1ca96f76",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c798f27be2cba1ca96f87",
        "name": "Xiaomi",
        "slug": "Xiaomi-z02F9hSuG",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c793f27be2cba1ca96f82",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c799827be2cba1ca96f88",
        "name": "Apple",
        "slug": "Apple-Ll9t6FRqF",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c793f27be2cba1ca96f82",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c79bc27be2cba1ca96f8a",
        "name": "Samsung",
        "slug": "Samsung-yhEs7lfFT",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c793f27be2cba1ca96f82",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c79c927be2cba1ca96f8b",
        "name": "Oneplus",
        "slug": "Oneplus-e_vMF_JoC",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c793f27be2cba1ca96f82",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c79d027be2cba1ca96f8c",
        "name": "Oppo",
        "slug": "Oppo-IxviXuTO5",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c793f27be2cba1ca96f82",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c79f927be2cba1ca96f8d",
        "name": "Mobile Accessories",
        "slug": "Mobile-Accessories-NgMl4pDRl",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c788c27be2cba1ca96f77",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a0c27be2cba1ca96f8e",
        "name": "Camera Accessories",
        "slug": "Camera-Accessories-w04InGnt0",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c788c27be2cba1ca96f77",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a1627be2cba1ca96f8f",
        "name": "Desktops Accessories",
        "slug": "Desktops-Accessories-syrMStOai",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c788c27be2cba1ca96f77",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a2127be2cba1ca96f90",
        "name": "Laptops Accessories",
        "slug": "Laptops-Accessories-3BzXUsH-l",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c788c27be2cba1ca96f77",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a3627be2cba1ca96f91",
        "name": "T shirt",
        "slug": "T-shirt-o3ZvKBaL9",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c78e827be2cba1ca96f7e",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a4127be2cba1ca96f92",
        "name": "Pant",
        "slug": "Pant-yo5usorXA",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c78e827be2cba1ca96f7e",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a4827be2cba1ca96f93",
        "name": "Panjabi",
        "slug": "Panjabi-8l6zGQOAf",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c78e827be2cba1ca96f7e",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a4f27be2cba1ca96f94",
        "name": "Jeans",
        "slug": "Jeans-q00-qEjRi",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c78e827be2cba1ca96f7e",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a7d27be2cba1ca96f95",
        "name": "Television",
        "slug": "Television-cc4IJe6qT",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c789e27be2cba1ca96f78",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a8727be2cba1ca96f96",
        "name": "Home Audio",
        "slug": "Home-Audio-eBnc-6A3Q",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c789e27be2cba1ca96f78",

      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7a9727be2cba1ca96f97",
        "name": "Hair Care",
        "slug": "Hair-Care-B6R1-eLTZ",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c78ab27be2cba1ca96f79",
      },
      {
        "order": 0,
        "categoryImage": "",
        "_id": "608c7aa227be2cba1ca96f98",
        "name": "Skin Care",
        "slug": "Skin-Care-OBbVKXnoh",
        "createdBy": "60428e4e69932031b03d3413",
        "parentId": "608c78ab27be2cba1ca96f79",
      }
]


let attributeData=[
    {
        "values": [
          "red",
          "white",
          "black",
          "blue"
        ],
        "_id": "6094fb12b01f5bf4e31adc0d",
        "name": "Color",
      },
      {
        "values": [
          "s",
          "l",
          "xl",
          "xxl"
        ],
        "_id": "6094fb24b01f5bf4e31adc0e",
        "name": "Size",
      },
      {
        "values": [
          "4",
          "6",
          "8"
        ],
        "_id": "6094fb43b01f5bf4e31adc0f",
        "name": "Ram",
      },
      {
        "values": [
          "32",
          "64",
          "128",
          "256"
        ],
        "_id": "6094fb52b01f5bf4e31adc10",
        "name": "Rom",
      }
]




exports.seedCreate=async(req,res)=>{
  let {password} = req.body
  if(!password){
    return res.status(404).json({error:"Password is required"})
  }

  User.findById(req.user._id)
  .then(async user=>{
    const isPassword = await user.authenticate(password);
    if(isPassword){
      try {
        await Brand.deleteMany().exec()
        await Product.deleteMany().exec()
        await Category.deleteMany().exec()
        await Attribute.deleteMany().exec()
    
    
        await Brand.insertMany(brandData)
        await Product.insertMany(productData)
        await Category.insertMany(categoryData)
        await Attribute.insertMany(attributeData)
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"something went wrong"})
    }
    }else{
      return res.status(400).json({error:"Password is not correct"})
    }
  })

}