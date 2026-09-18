'use client'
// @ts-ignore
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

import { usePageContext } from "@/components/Providers/PageContext";

const TawkMessenger = () => {
    const { settings } = usePageContext();
  return (
   <>
     {settings?.chat.chatPropertyId && settings?.chat?.chatWidgetId && (
        <TawkMessengerReact propertyId={settings?.chat.chatPropertyId} widgetId={settings?.chat?.chatWidgetId} />
      )}
   </>
  );
};
export default TawkMessenger;
