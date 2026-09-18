import React, { forwardRef, useState, useEffect } from "react";
import styles from "./searchDropDown.module.scss";
import { PopularIcon } from "@/app/global/svg";
import { FaFolder, FaFolderOpen, FaShoppingCart } from "react-icons/fa";

const LOCAL_STORAGE_KEY = "suggestionHistory";

const SearchDropDown = forwardRef<HTMLDivElement, any>(
  ({ isLoading, popularCategories, productName, suggestionList, handleSuggestionList }, ref) => {
    const [suggestionHistory, setSuggestionHistory] = useState<any[]>([]);

    useEffect(() => {
      const history = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      setSuggestionHistory(history);
    }, []);

    const handleSuggestionClick = (suggestion: any) => {
      handleSuggestionList(suggestion);

      const updatedHistory = [...suggestionHistory.filter(item => item.id !== suggestion.id), suggestion];

      setSuggestionHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSuggestionHistory([]);
    };

    const darkenMatch = (text: string, query: string) => {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, "gi"); // Case-insensitive matching
      const parts = text.split(regex);
      return parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className={styles.darkened}>
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    const getIcon = (type: string) => {
      switch (type) {
        case "category":
          return <FaFolder className={styles.icon} />;
        case "subcategory":
          return <FaFolderOpen className={styles.icon} />;
        case "product":
          return <FaShoppingCart className={styles.icon} />;
        default:
          return <span className={styles.defaultIcon}>?</span>;
      }
    };

    const capitalizeFirstLetter = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    return (
      <div ref={ref} className={styles.Container}>
        {productName ? (
          <div className={styles.suggestionWrapper}>
            <div className={styles.suggestionContainer}>
              {isLoading ? (
                <div className={styles.dottedLoading}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              ) : suggestionList.length > 0 ? (
                suggestionList.map((suggestion: any) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <a className={styles.suggestions}>
                      <div className={styles.suggestionLeft}>
                        {/* {suggestion.value} */}
                        {darkenMatch(suggestion.value, productName)}
                      </div>
                      <div className={styles.suggestionRight}>
                        <span className={styles.suggestionRightIcon}>{getIcon(suggestion.key)}</span>
                        <span>{capitalizeFirstLetter(suggestion.key)}</span>
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <div className={styles.noDataFound}>No Data Found</div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {suggestionHistory.length > 0 && (
              <div className={styles.lastSearchWrapper}>
                <div className={styles.lastSearchHead}>
                  <span className={styles.lastSearchTitle}>
                    My Past Searches
                  </span>
                  <button className={styles.clearLastSearch} onClick={clearHistory}>
                    Clear
                  </button>
                </div>
                <div className={styles.lastSearchList}>
                  {suggestionHistory.map((item: any) => (
                    <a key={item.id}>
                      <div className={styles.lastSearchValue} onClick={() => handleSuggestionList(item)}>
                        <span className={styles.lastSearchValueIcon}>{getIcon(item.key)}</span>
                        <span>{item.value}</span>
                      </div>
                      <div
                        className={styles.removeCurrentHistorySearch}
                        onClick={() => {
                          const updatedHistory = suggestionHistory.filter(
                            (historyItem) => historyItem.id !== item.id
                          );
                          setSuggestionHistory(updatedHistory);
                          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
                        }}
                      >
                        x
                      </div>

                    </a>
                  ))}

                </div>
              </div>)}

            <div className={styles.popularCategoriesWrapper}>
              <span className={styles.popularCategoriesHead}>
                Popular Categories
              </span>
              <div className={styles.categoriesList}>
                {popularCategories?.map((category: any) => (
                  <div key={category.id} className={styles.categoryItem} onClick={() => handleSuggestionClick(category)}>
                    <PopularIcon className={styles.categoryIcon} />
                    <a className={styles.categoryTitle}>{category?.value}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default SearchDropDown;
