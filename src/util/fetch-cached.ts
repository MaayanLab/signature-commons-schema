import fetch from 'node-fetch'
import debug from './debug'

const cache: {
  [key: string]: object
} = {}

/**
 * Fetch object from remote, caching any results.
 *  Treats `^/` as an `import`,
 *  @dcic/signature-commons-schema pointing to the local tree
 * 
 * @param url The url to fetch the object from
 */
export async function fetch_cached<T extends {} = {}>(url: string): Promise<T> {
  if(url.indexOf('/') === 0) {
    // Fetch url's that start with / as impots
    const m = /^\/@dcic\/signature-commons-schema(\/v\d+)?(.*)$/.exec(url)
    if (m) {
      if (m[1] === '/v3') {
        cache[url] = await import(`../..${m[2]}`)
      } else if (m[1] === undefined) {
        url = `https://raw.githubusercontent.com/dcic/signature-commons-schema/v1${m[2]}`
      } else {
        url = `https://raw.githubusercontent.com/dcic/signature-commons-schema${m[1]}${m[2]}`
      }
    }
  }

  if(cache[url] === undefined) {
    // Fetch other urls as actual urls
    cache[url] = await (await fetch(url)).json()
  }

  return cache[url] as T
}
