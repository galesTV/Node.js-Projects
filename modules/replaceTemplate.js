module.exports = (temp, product) => {
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%PRODUCT_EMOJI%}/g, product.image);
    output = output.replace(/{%PRODUCT_ORIGIN%}/g, product.from);
    output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
    output = output.replace(/{%PRODUCT_ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%PRODUCT_ORGANIC%}/g, 'not-organic' );
    return output;
}