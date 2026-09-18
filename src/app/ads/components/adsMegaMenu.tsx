import megamenu from "./allcategoryStyle.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { categorySelector } from "@/redux/slice/categoriesSlice";
import ImageComponent from "@/components/ImageComponent";
import { usePageContext } from "@/components/Providers/PageContext";
import Link from "next/link";
import { CategoryName } from "@/services/utils/helperURL";
import { useEffect, useState } from "react";
import { fetchSubCategories } from "@/redux/slice/categoriesSlice";

interface Props {
  closePopover: () => void;
}
export default function AdsMegaMenu({ closePopover }: Props) {
  const { responsiveView, baseUrl } = usePageContext();
  const dispatch = useAppDispatch();
  const [active, setActive] = useState("");
  const { propertycategory, subCategories, activeSubcategory } =
    useAppSelector(categorySelector);
  useEffect(() => {
    if (active) {
      if (!subCategories[active]) {
        const url = `ads/subCategories/${active}`;
        dispatch(fetchSubCategories(url, active));
      }
    } else if (propertycategory.length > 1) {
      setActive(propertycategory[1]._id);
    }
  }, [active, propertycategory]);

  const len = propertycategory.length;

  return (
    <div className={megamenu.container}>
      <ul className={megamenu.ulContainer}>
        {propertycategory.map((cat: any, i: number) => (
          <li key={i}
            className={`${megamenu.listcontent}${
              active === cat._id ||
              (active === "" && activeSubcategory === cat._id)
                ? ` ${  megamenu.selected}`
                : ""
            }`}
            onMouseEnter={() => {
              if (!cat.category.includes("ALL")) setActive(cat._id);
            }}
          >
            <div
              className={`${megamenu.linkContainer}${
                i + 1 === len ? ` ${megamenu.linkBottomPadding}` : ""
              }`}
            >
              <Link
                href={`/ads/${CategoryName(cat.category)}`}
                className={megamenu.link}
              >
                <ImageComponent
                  className="me-2"
                  src={cat.icon}
                  // altSrc={'/images/dummycategory.jpg'}
                  width={24}
                  height={24}
                  alt={`category_${i}`}
                  style={
                    cat?.icon
                      ? {}
                      : {
                          opacity: "0.65"
                        }
                  }
                  priority
                />
                <span className={megamenu.mainCategoryList}>{cat.category}</span>
              </Link>
            </div>
            <div className={megamenu.expandsub}>
              <div className={megamenu.categoryTitle}>{cat.category}</div>
              {Array.isArray(subCategories[cat._id]) && (
                <ul className={megamenu.categoryColumns}>
                  <li>
                    <ul className={megamenu.subcategoryList}>
                      {subCategories[cat._id].map((sub: any, si: number) => (
                        <li key={si} className={megamenu.categoryList}>
                          <Link
                            href={`/ads/${CategoryName(
                              cat.category
                            )}?subCategory=${sub._id}`}
                            onClick={closePopover}
                            style={{ color: "#000"}}
                          >
                            {sub.subCategory}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
