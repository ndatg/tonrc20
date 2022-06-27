const TonWeb = require("tonweb");
const TonWebMnemonic = require('tonweb-mnemonic');
const { Address } = require("tonweb").utils;
const TONRC20 = require('./tonrc20');

// UQBYXWigdV2Z_hf3htONjuAYDUObFy5qDLTZ2VWHK0K07LPh
const mnemonic1 = [
    'often',  'like',  'ginger',
    'glass',  'warm',  'element',
    'bind',   'fix',   'exercise',
    'arm',    'also',  'stumble',
    'green',  'label', 'awful',
    'proof',  'fan',   'head',
    'travel', 'dumb',  'little',
    'two',    'cake',  'kick'
];

// UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH
const mnemonic2 = [
    'peace',   'gloom',   'few',
    'mule',    'fantasy', 'enjoy',
    'tag',     'manual',  'digital',
    'build',   'image',   'dog',
    'comfort', 'pet',     'moral',
    'mystery', 'snack',   'soup',
    'point',   'find',    'find',
    'coffee',  'street',  'almost'
];

const provider = new TonWeb.HttpProvider(
    'https://testnet.toncenter.com/api/v2/jsonRPC',
    { apiKey: '' }
);

const tonweb = new TonWeb(provider);

async function tonTransfer(keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: params.to,
            amount: params.amount,
            seqno: seqno,
            sendMode: 3
        }).send()
    );
}

async function deploy(contract, keyPair) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: null, // body
            sendMode: 3,
            stateInit: (await contract.createStateInit()).stateInit
        }).send()
    );
}

async function transfer(contract, keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: await contract.createTransferBody({
                to: params.to,
                amount: params.amount,
            }),
            sendMode: 64
        }).send()
    );
}

async function mint(contract, keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: await contract.createMintBody({
                account: params.account,
                amount: params.amount,
            }),
            sendMode: 3
        }).send()
    );
}



async function burn(contract, keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: await contract.createBurnBody({
                account: params.account,
                amount: params.amount,
            }),
            sendMode: 3
        }).send()
    );
}

async function approve(contract, keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: await contract.createApproveBody({
                spender: params.spender,
                amount: params.amount,
            }),
            sendMode: 3
        }).send()
    );
}

async function increaseAllowance(contract, keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: await contract.createIncreaseAllowanceBody({
                spender: params.spender,
                addedValue: params.addedValue,
            }),
            sendMode: 3
        }).send()
    );
}

async function decreaseAllowance(contract, keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: await contract.createDecreaseAllowanceBody({
                spender: params.spender,
                subtractedValue: params.subtractedValue,
            }),
            sendMode: 3
        }).send()
    );
}

async function transferFrom(contract, keyPair, params) {
    const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, false, false));

    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log('seqno=', seqno);

    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: (await contract.getAddress()).toString(true, true, false, false),
            amount: TonWeb.utils.toNano('1'),
            seqno: seqno,
            payload: await contract.createTransferFromBody({
                from: params.from,
                to: params.to,
                amount: params.amount
            }),
            sendMode: 3
        }).send()
    );
}

// async function unknown(contract, keyPair) {
//     const wallet = new tonweb.wallet.all.v3R1(provider, { publicKey: keyPair.publicKey, wc: 0 });
//     const walletAddress = await wallet.getAddress();
//     console.log('wallet address=', walletAddress.toString(true, true, false, false));
//
//     const seqno = (await wallet.methods.seqno().call()) || 0;
//     console.log('seqno=', seqno);
//
//     console.log(
//         await wallet.methods.transfer({
//             secretKey: keyPair.secretKey,
//             toAddress: (await contract.getAddress()).toString(true, true, false, false),
//             amount: TonWeb.utils.toNano(1),
//             seqno: seqno,
//             payload: await contract.createUnknownBody({}),
//             sendMode: 3
//         }).send()
//     );
// }

async function init() {
    const contract = new TONRC20(provider, {
        name: 'My Token',
        symbol: 'MTKN',
        decimals: 9,
        totalSupply: TonWeb.utils.toNano('0'),
        salt: 1656344980470 // salt for unique address (timestamp, only for creation)
    });
    const contractAddress = await contract.getAddress();
    console.log('contract address= ', contractAddress.toString(true, true, false, false));

    const keyPair1 = await TonWebMnemonic.mnemonicToKeyPair(mnemonic1);
    const keyPair2 = await TonWebMnemonic.mnemonicToKeyPair(mnemonic2);
    // console.log(await TonWebMnemonic.generateMnemonic(24));

    // await tonTransfer(keyPair1, { to: contractAddress, amount: TonWeb.utils.toNano(0.5) });

    // await deploy(contract, keyPair1);

    // await mint(contract, keyPair1, {
    //     account: new Address('UQBYXWigdV2Z_hf3htONjuAYDUObFy5qDLTZ2VWHK0K07LPh'),
    //     amount: TonWeb.utils.toNano('10')
    // });

    // await burn(contract, keyPair1, {
    //     account: new Address('UQBYXWigdV2Z_hf3htONjuAYDUObFy5qDLTZ2VWHK0K07LPh'),
    //     amount: TonWeb.utils.toNano('1')
    // });

    // await transfer(contract, keyPair1, {
    //     to: new Address('UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH'),
    //     amount: TonWeb.utils.toNano('5')
    // });

    // await approve(contract, keyPair1, {
    //     spender: new Address('UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH'),
    //     amount: TonWeb.utils.toNano('2')
    // });

    // await increaseAllowance(contract, keyPair1, {
    //     spender: new Address('UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH'),
    //     addedValue: TonWeb.utils.toNano('1')
    // });

    // await decreaseAllowance(contract, keyPair1, {
    //     spender: new Address('UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH'),
    //     subtractedValue: TonWeb.utils.toNano('1')
    // });

    // await transferFrom(contract, keyPair2, {
    //     from: new Address('UQBYXWigdV2Z_hf3htONjuAYDUObFy5qDLTZ2VWHK0K07LPh'),
    //     to: new Address('UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH'),
    //     amount: TonWeb.utils.toNano('2')
    // });

    // await unknown(contract, keyPair1);

    console.log(await contract.getName());
    console.log(await contract.getSymbol());
    console.log(await contract.getDecimals());
    console.log(await contract.getTotalSupply());
    console.log(await contract.getBalanceOf(new Address('UQBYXWigdV2Z_hf3htONjuAYDUObFy5qDLTZ2VWHK0K07LPh')));
    console.log(await contract.getBalanceOf(new Address('UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH')));
    console.log(await contract.getAllowance(
        new Address('UQBYXWigdV2Z_hf3htONjuAYDUObFy5qDLTZ2VWHK0K07LPh'),
        new Address('UQArbZWeiA9W8wAqdW_Ugska6W7lXaqNnVhvYYKdSjoxdVdH')
    ));
}

init();
