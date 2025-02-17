import RSS from "rss"
import { products } from "../productList"

export async function GET() {

  const feed = new RSS({
    title: 'Dudick Product Feed',
    description: "Reformatted DPM Feed",
    generator: 'RSS for Node and Next.js',
    feed_url: 'https://tvollmer89.github.io/dudick-xml-feed/feed.xml',
    site_url: 'https://tvollmer89.github.io/dudick-xml-feed/',
    managingEditor: 'Theresa Vollmer)',
    webMaster: 'Theresa Vollmer',
    copyright: `Copyright ${new Date().getFullYear().toString()}, Theresa Vollmer`,
    language: 'en-US',
    pubDate: new Date().toUTCString(),
    ttl: 60,
});

  console.log(`products: ${products}`)
  products.map(p => {
    let prod = p.product;
    let links = prod.links.map(l => {
      // return {"link": {
      //   _attr: {
      //     name: l.link.name,
      //     href: l.link['@_url'],
      //     type: l.link['@_type']
      //   }
      // }}
      return {"link": [
        {"name": l.link.name},
        {"url": l.link['@_url']},
        {"type": l.link['@_type']}
      ]}

    })

    // TODO: Replace "&" and "<" here ?
    feed.item({
      title: prod.name,
      description: prod.description,
      custom_elements: [
        {'id': prod.id},
        {'family': prod.family},
        {'types': prod.types},
        {'applications': prod.applications},
        {'markets': prod.markets},
        {'features': prod.features},
        {'genericType': prod.genericType},
        {'designation': prod.designation},
        {'productfinish': prod.productfinish},
        {'productdfts': prod.productdfts},
        {'solidscontent': prod.solidscontent},
        {'solidsmeasurement': prod.solidsmeasurement},
        {'solidsvalue': prod.solidsvalue},
        {'vocvalues': prod.vocvalues},
        {'dtrs': prod.dtrs},
        {'ratio': prod.ratio},
        {'potlife': prod.potlife},
        {'potlifecomments': prod.potlifecomments},
        {'cureschedule': prod.cureschedule},
        {'locale': prod.locale},
        {'links': links}
      ]
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
});
}