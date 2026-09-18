export const replaceStarsInMobileNumber = (number:any, val: boolean) => {
    const envValue =  val

    if(number){
    if (envValue) {
       const visiblePart = number.substring(0, 3);
       const lastTwo = number.slice(-2)
       const maskedPart = number.substring(3).replace(/\d/g, '*');
       return visiblePart + maskedPart + lastTwo;
    }
 }
    return (number)
 }
 
 export const replaceStarsInEmailAddress = (email:any, val: boolean) => {
    const envValue =  val

    if(email){ 
     if (envValue && email.includes("@") ) {
      const parts = email.split('@');
      const part2 = parts[1].split('.')
 
       // Hide part of the local part with asterisks
       const hiddenLocalPart = `${parts[0].substring(0, Math.min(2, parts[0].length))  }****`;
       const secondPart = `${part2[0].substring(0, Math.min(0, part2[0].length))  }****`;
 
       // Concatenate the hidden local part and the domain part
       const hiddenEmail = `${hiddenLocalPart  }@${  secondPart  }.${  part2[1]}`;
       return hiddenEmail;
    }
 }
       return email;
 }
