/**
 * Build the product list here and export it to route.ts!
 */

const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
import fetch from 'node-fetch';
import { updateList } from "./update-list";
const feedUrl = "https://ccrm3.rpmsfa.com/CarbolineRpmConnectorWar/sitefeed1.action?regionId=1&languageId=1";
let xmlFile = "";
let productList;


async function getProducts() {
  try {
    const response = await fetch('feedUrl');

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    xmlFile = await response.json();
    validate();
  } catch (err) {
    console.log(err);
  }
}
// let xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//        xmlFile = new XMLSerializer().serializeToString(xhttp.responseXML.firstElementChild);
//       validate();
//     }
// };
// xhttp.open("GET", feedUrl, true);
// xhttp.send();


const validate = () => {
  const result = XMLValidator.validate(xmlFile);
  if (result === true) {
    console.log(`XML file is valid`, result);
    parseFeed();
  } else {
    console.log(`XML is invalid because of - ${result.err.msg}`, result);   
  }
}
const parseFeed = () => {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix : "@_",
  };
  const parser = new XMLParser(options);
  let json = parser.parse(xmlFile);
  productList = json.carbproductlist.carbproduct;
  
  // console.log(`json count: ${Object.keys(json.carbproductlist)}`)
  
  const dudickProducts = productList.filter((p) => p.brand == "Dudick");
  console.log(`data: ${JSON.stringify(dudickProducts)}`);
  console.log(`dudick product count: ${dudickProducts.length}`)
  // productList.forEach(i => console.log(`i: ${i.productname}`))
  dudickProducts.sort(function(a,b){
    var textA = a.productname.toUpperCase();
    var textB = b.productname.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  let products = updateList(dudickProducts);

  // build new xml? 
  const builder = new XMLBuilder({
    arrayNodeName: "products",
    oneListGroup:"true",
    ignoreAttributes : false,
    attributeNamePrefix : "@_",
    format: true
  });
  const xmlOutput = builder.build(products);
  return products;
}

export {parseFeed}