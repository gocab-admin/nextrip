import { useMemo } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

import { usePageContext } from "@/components/Providers/PageContext";

const libraries: any = ["places"];

function useMapLoader() {
  const { settings } = usePageContext();
  const googleMapsApiKey = settings?.google?.mapApiKey;
  const mapOptions = useMemo(
    () => ({
      id: "google-map-script",
      googleMapsApiKey,
      libraries
    }),
    [googleMapsApiKey]
  );
  const { isLoaded } = useJsApiLoader(mapOptions);

  return { isLoaded };
}

export default useMapLoader;
