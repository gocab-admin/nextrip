import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";

import { handleImageError } from "@/services/utils/utils";

import ImageComponent from "./ImageComponent";

export const CustomImage = (props: any) => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
	}, [loaded]);

	return (
		<>
			<ImageComponent
				src={props.src}
				alt={props.alt}
				onError={handleImageError}
				layout="fill"
				objectFit="cover"
				className={
					loaded ? props.className : `${props.className || ""  } d-none`
				}
				onLoad={() => {
					setLoaded(true);
				}}
			/>
			{loaded ? (
				<></>
			) : (
				<Skeleton
					variant="rectangular"
					animation="wave"
					width={props.loaderWidth || props.style.width}
					height={props.loaderHeight || props.style.height}
				/>
			)}
		</>
	);
};
