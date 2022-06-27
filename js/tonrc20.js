const { Contract } = require('tonweb');
const { Address, bytesToHex, bytesToBase64 } = require("tonweb").utils;
const { Cell } = require('tonweb').boc;

const HEX = 'B5EE9C724102330100041F000114FF00F4A413F4BCF2C80B01020120020302014804050004F2300202CB0607020120272802012008090201481D1E0201200A0B02012012130201200C0D0019D686A6A6983E9FFFA027A0218404ED401D0D3030171B0925F03E021C700925F03E0FA403001D31FD33F715230BA8E1C5230F010708306F8276F108208989680A05006A1104510344130F015E0725230BA8E1C5230F011708306F8276F108208989680A05006A1104510344130F015E0735230BAE302745230BAE302755230BAE302765230BA80E0F10110023505C8CC14CC12CB07CBFFF400F400C9ED54800385230F012708306F8276F108208989680A05006A1104510344130F01500385230F013708306F8276F108208989680A05006A1104510344130F01500385230F014708306F8276F108208989680A05006A1104510344130F01500AA8E1FFA40D3FF30F00E708306F8276F108208989680A05006A1104510344130F015E0775230BA8E1FFA40D3FF30F00F708306F8276F108208989680A05006A1104510344130F015E010345F04841F7020804021F0150475F76A27802147D2218C080C880E180797A13FD2218C080C900E180797A288C6D9E288C6D9E4080C9A99CDF797A289450A9506D9E1C93501B2A13B3432321C140201201516010EDB3C355522F0031C02012017180201201A1B014D3B513C010A3E910C6040650070C03CBD09FE910C6040654070C03CBD1204D41DB6CF11503C00E019013F3B513C011B145776CF0C48213FEF67204065D4C4AFBCBD00687C032497C138A02D003602FA443101FA44316D03C8CBFF40138307F443C8F400028307F443024D3B513C0109FE910C6040660070C03CBD1449A81445F6CF09E80DD5081DF6CF0D840D510C3C00E0321C025B3B513C0109FE910C6040664070C03CBD1445F6CF20406694C62FBCBD09E854A036CF0DD445684D440D510C3C00E0321C001A01FA443101C8CBFF028307F4430201201F20020148252602012021220201202324000F3E9034FFCC3C02E0000F3E9034FFCC3C0320012D3B513C011B14407E9034FFCC150C8C76CF0C56283C03202D013D3B513C011B14407E9034FFCC150C8C76CF0C60406594C4EFBCBD16287C03202D001F3E903E9034FFCC1514913C03563C02E0008308308024DC3EC0A44C38954C321C20063232C15401B3C5963E808532DA84B2C7F2CFC833CC48B3CC6821026F25C0725C5632C03325DC4072C00073C5F8B2407EC020020120292A0201202E2F0201662B2C0119B8347ED44F0046C5159DB3C3182D0011AF5376A278022F82C00015AEF3F6A278020822AF82C0004E7002FA4431238307F40E6FA18E16F4043001FA4431018307F40E6FA19431D3FF309130E2915BE202015830310015BBF12ED44F00410255F0580015B1233B513C01040D57C160011BB251BB513C010557C14076CF0C603200287001FA4431228307F40E6FA19431D3FF309130E2D256774D';

class TONRC20Contract extends Contract {
    constructor(provider, options) {
        options.wc = 0;
        options.code = options.code || Cell.oneFromBoc(HEX);
        super(provider, options);
    }

    createCodeCell() {
        if (!this.options.code) throw new Error('Contract: options.code is not defined')
        return this.options.code;
    }

    createDataCell() {
        const cell = new Cell();

        const nameCell = new Cell();
        nameCell.bits.writeString(this.options.name);
        cell.refs[0] = nameCell;

        const symbolCell = new Cell();
        symbolCell.bits.writeString(this.options.symbol);
        cell.refs[1] = symbolCell;

        cell.bits.writeUint(this.options.decimals, 8);
        cell.bits.writeUint(this.options.totalSupply, 256);
        cell.bits.writeUint(0, 1); // balances
        cell.bits.writeUint(0, 1); // allowances

        if (this.options.salt) {
            cell.bits.writeUint(this.options.salt, 64); // salt
        }

        return cell;
    }

    async createStateInit() {
        const codeCell = this.createCodeCell();
        const dataCell = this.createDataCell();
        const stateInit = Contract.createStateInit(codeCell, dataCell);
        const stateInitHash = await stateInit.hash();
        const address = new Address(this.options.wc + ":" + bytesToHex(stateInitHash));
        return {
            stateInit: stateInit,
            address: address,
            code: codeCell,
            data: dataCell,
        }
    }

    createTransferBody(params) {
        const cell = new Cell();

        cell.bits.writeUint(0x00000001, 32);
        cell.bits.writeUint(+new Date(), 64);
        cell.bits.writeAddress(params.to);
        cell.bits.writeUint(params.amount, 256);

        return cell;
    }

    createApproveBody(params) {
        const cell = new Cell();

        cell.bits.writeUint(0x00000002, 32);
        cell.bits.writeUint(+new Date(), 64);
        cell.bits.writeAddress(params.spender);
        cell.bits.writeUint(params.amount, 256);

        return cell;
    }

    createIncreaseAllowanceBody(params) {
        const cell = new Cell();

        cell.bits.writeUint(0x00000003, 32);
        cell.bits.writeUint(+new Date(), 64);
        cell.bits.writeAddress(params.spender);
        cell.bits.writeUint(params.addedValue, 256);

        return cell;
    }

    createDecreaseAllowanceBody(params) {
        const cell = new Cell();

        cell.bits.writeUint(0x00000004, 32);
        cell.bits.writeUint(+new Date(), 64);
        cell.bits.writeAddress(params.spender);
        cell.bits.writeUint(params.subtractedValue, 256);

        return cell;
    }

    createTransferFromBody(params) {
        const cell = new Cell();

        cell.bits.writeUint(0x00000005, 32);
        cell.bits.writeUint(+new Date(), 64);
        cell.bits.writeAddress(params.from);
        cell.bits.writeAddress(params.to);
        cell.bits.writeUint(params.amount, 256);

        return cell;
    }

    createMintBody(params) {
        const cell = new Cell();

        cell.bits.writeUint(0x00000006, 32);
        cell.bits.writeUint(+new Date(), 64);
        cell.bits.writeAddress(params.account);
        cell.bits.writeUint(params.amount, 256);

        return cell;
    }

    createBurnBody(params) {
        const cell = new Cell();

        cell.bits.writeUint(0x00000007, 32);
        cell.bits.writeUint(+new Date(), 64);
        cell.bits.writeAddress(params.account);
        cell.bits.writeUint(params.amount, 256);

        return cell;
    }

    // only for test
    // createUnknownBody(params) {
    //     const cell = new Cell();
    //
    //     cell.bits.writeUint(0x77777777, 32);
    //     cell.bits.writeUint(+new Date(), 64);
    //
    //     return cell;
    // }

    async getName() {
        const address = (await this.getAddress()).toString();
        const result = await this.provider.call2(address, 'name');
        return Buffer.from(result.bits.toString(), 'hex').toString('utf8');
    }

    async getSymbol() {
        const address = (await this.getAddress()).toString();
        const result = await this.provider.call2(address, 'symbol');
        return Buffer.from(result.bits.toString(), 'hex').toString('utf8');
    }

    async getDecimals() {
        const address = (await this.getAddress()).toString();
        const result = await this.provider.call2(address, 'decimals');
        return result.toNumber();
    }

    async getTotalSupply() {
        const address = (await this.getAddress()).toString();
        const result = await this.provider.call2(address, 'total_supply');
        return result.toNumber();
    }

    async getBalanceOf(account) {
        const address = (await this.getAddress()).toString();

        const accountCell = new Cell();
        accountCell.bits.writeAddress(account);

        const result = await this.provider.call2(address, 'balance_of', [
            ['tvm.Slice', bytesToBase64(await accountCell.toBoc(false))]
        ]);
        return result.toNumber();
    }

    async getAllowance(owner, spender) {
        const address = (await this.getAddress()).toString();

        const ownerCell = new Cell();
        ownerCell.bits.writeAddress(owner);

        const spenderCell = new Cell();
        spenderCell.bits.writeAddress(spender);

        const result = await this.provider.call2(address, 'allowance', [
            ['tvm.Slice', bytesToBase64(await ownerCell.toBoc(false))],
            ['tvm.Slice', bytesToBase64(await spenderCell.toBoc(false))]
        ]);
        return result.toNumber();
    }
}

module.exports = TONRC20Contract;
