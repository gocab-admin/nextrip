import { MetadataRoute } from 'next'
 
export default function manifest(): Promise<MetadataRoute.Manifest> {
  return new Promise((resolve, reject) => {
    fetch('https://airstardevapi.abservetechdemo.com/public/manifest.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}