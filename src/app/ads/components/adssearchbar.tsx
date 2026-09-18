import { usePageContext } from "@/components/Providers/PageContext";
import SearchBar from "@/app/ads/components/adsmobilesearch";
import SearchComponent from "./SearchComponent";

const SearchBarComp = ({ props, isLoaded }: any) => {
  const { responsiveView } = usePageContext();
  return (
    <>
      {" "}
      {!props.center && (
        <>
          {responsiveView === "sm" || responsiveView === "xs" ? (
            <>
              <SearchBar isLoaded={isLoaded} />
            </>
          ) : (
            <SearchComponent isLoaded={isLoaded}/>
          )}
        </>
      )}
    </>
  );
};

export default SearchBarComp;
