import React, { useState } from "react";

import { usePageContext } from "@/components/Providers/PageContext";

function SelectBox() {
  const { i18 } = usePageContext();
  // State to track the selected option
  const [selectedOption, setSelectedOption] = useState("");

  // Function to handle the change in the select box
  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <select
        id="selectBox"
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value="option1">{i18?.TAX?.OPTION || "Option"} 1</option>
        <option value="option2">{i18?.TAX?.OPTION || "Option"} 2</option>
        <option value="option3">{i18?.TAX?.OPTION || "Option"} 3</option>
      </select>
    </div>
  );
}

export default SelectBox;
