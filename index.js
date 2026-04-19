const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error!');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written');
//             });
//         });
//     });
// });
// console.log('Will read file!');

//////////////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data).map(el => {
    return {
        ...el,
        slug: slugify(el.productName, { lower: true })
    };
}); // Create a slug for each product based on its name, to be used in the URL

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    // Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
    
    // Product page
    } else if(pathname.startsWith('/product/')) { // Verifies if the URL starts with /product/ to identify the product to be displayed
        res.writeHead(200, { 'Content-type': 'text/html' });

        const slug = pathname.split('/')[2]; // Extracts the slug from the URL (e.g., /product/fresh-avocados -> fresh-avocados)
        const product = dataObj.find(el => el.slug === slug); // Finds the product corresponding to the extracted slug

        if (!product) {
            res.writeHead(404, { 'Content-type': 'text/html' });
            return res.end('<h1>Product not found!</h1>');
        } // If no product is found with the given slug, return a 404 error

        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    // API
    } else if(pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server is listening on port 8000');
});