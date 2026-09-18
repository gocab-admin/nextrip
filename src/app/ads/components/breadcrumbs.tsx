"use client";

import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
// import { useRouter } from "next/router"; // Older version
import { usePathname } from "next/navigation";

const BreadCrumb = ({activeSubCat}: any) => {
  // const { pathname } = useRouter(); // Older version
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter(Boolean); // ✅ Remove empty elements

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ my: 1 }}>
      {pathnames.map((name, index) => {
        const isLast = index === pathnames.length - 1;
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;

        return isLast ? (
          <Typography key={index} color="text.primary">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
        ) : (
          <Link key={index} href={routeTo} color="inherit">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
