import _ from 'lodash'
import { Buffer } from '@taichunmin/buffer'
import { ChameleonUltra } from './ChameleonUltra'
import BufferMockAdapter from './plugin/BufferMockAdapter'
import {
  AnimationMode,
  ButtonAction,
  ButtonType,
  DarksideStatus,
  DeviceMode,
  DeviceModel,
  FreqType,
  Mf1EmuWriteMode,
  Mf1KeyType,
  Mf1PrngType,
  Mf1VblockOperator,
  Slot,
  TagType,
} from './enums'

describe('ChameleonUltra with BufferMockAdapter', () => {
  let ultra: ChameleonUltra
  let adapter: BufferMockAdapter

  beforeEach(async () => {
    ultra = new ChameleonUltra()
    adapter = new BufferMockAdapter()
    await ultra.use(adapter)
  })

  test('#cmdBleDeleteAllBonds()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0408 0068 0000 8c 00'))

    // act
    await ultra.cmdBleDeleteAllBonds()

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0408 0000 0000 f4 00')])
  })

  test('#cmdBleGetAddress()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f4 0068 0006 9b d9cbc1d2b25f b8'))

    // act
    const actual = await ultra.cmdBleGetAddress()

    // assert
    expect(actual).toEqual('D9:CB:C1:D2:B2:5F')
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f4 0000 0000 09 00')])
  })

  test('#cmdBleGetPairingKey()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0407 0068 0006 87 313233343536 cb'))

    // act
    const actual = await ultra.cmdBleGetPairingKey()

    // assert
    expect(actual).toEqual('123456')
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0407 0000 0000 f5 00')])
  })

  test('#cmdBleGetPairingMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 040c 0068 0001 87 00 00'))

    // act
    const actual = await ultra.cmdBleGetPairingMode()

    // assert
    expect(actual).toEqual(false)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 040c 0000 0000 f0 00')])
  })

  test('#cmdBleSetPairingKey()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0406 0068 0000 8e 00'))

    // act
    await ultra.cmdBleSetPairingKey('123456')

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0406 0000 0006 f0 313233343536 cb')])
  })

  test('#cmdBleSetPairingMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 040d 0068 0000 87 00'))

    // act
    await ultra.cmdBleSetPairingMode(false)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 040d 0000 0001 ee 00 00')])
  })

  test('#cmdChangeDeviceMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00'))

    // act
    await ultra.cmdChangeDeviceMode(DeviceMode.TAG)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03e9 0000 0001 13 00 00')])
  })

  test('#cmdEnterBootloader()', async () => {
    // act
    await ultra.cmdEnterBootloader()

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f2 0000 0000 0b 00')])
  })

  test('#cmdGetAnimationMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f8 0068 0001 9c 00 00'))

    // act
    const actual = await ultra.cmdGetAnimationMode()

    // assert
    expect(actual).toEqual(AnimationMode.FULL)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f8 0000 0000 05 00')])
  })

  test('#cmdGetAppVersion()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e8 0068 0002 ab 0200 fe'))

    // act
    const actual = await ultra.cmdGetAppVersion()

    // assert
    expect(actual).toEqual('2.0')
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03e8 0000 0000 15 00')])
  })

  test('#isSupportedAppVersion()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e8 0068 0002 ab 0200 fe'))

    // act
    const actual = await ultra.isSupportedAppVersion()

    // assert
    expect(actual).toEqual(true)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03e8 0000 0000 15 00')])
  })

  test('#cmdGetBatteryInfo()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0401 0068 0003 90 105461 3b'))

    // act
    const actual = await ultra.cmdGetBatteryInfo()

    // assert
    expect(actual).toEqual({ level: 97, voltage: 4180 })
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0401 0000 0000 fb 00')])
  })

  test('#cmdGetButtonLongPressAction()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0404 0068 0001 8f 03 fd'))

    // act
    const actual = await ultra.cmdGetButtonLongPressAction(ButtonType.BUTTON_A)

    // assert
    expect(actual).toEqual(ButtonAction.CLONE_IC_UID)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0404 0000 0001 f7 41 bf')])
  })

  test('#cmdGetButtonPressAction()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0402 0068 0001 91 01 ff'))

    // act
    const actual = await ultra.cmdGetButtonPressAction(ButtonType.BUTTON_A)

    // assert
    expect(actual).toEqual(ButtonAction.CYCLE_SLOT_INC)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0402 0000 0001 f9 41 bf')])
  })

  test('#cmdGetDeviceChipId()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f3 0068 0008 9a bbef76355a6a2068 5f'))

    // act
    const actual = await ultra.cmdGetDeviceChipId()

    // assert
    expect(actual).toEqual('bbef76355a6a2068')
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f3 0000 0000 0a 00')])
  })

  test('#cmdGetDeviceMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03ea 0068 0001 aa 00 00'))

    // act
    const actual = await ultra.cmdGetDeviceMode()

    // assert
    expect(actual).toEqual(DeviceMode.TAG)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03ea 0000 0000 13 00')])
  })

  test('#cmdGetDeviceModel()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0409 0068 0001 8a 00 00'))

    // act
    const actual = await ultra.cmdGetDeviceModel()

    // assert
    expect(actual).toEqual(DeviceModel.ULTRA)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0409 0000 0000 f3 00')])
  })

  test('#cmdGetDeviceSettings()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 040a 0068 000d 7d 05000102030400313233343536 bc'))

    // act
    const actual = await ultra.cmdGetDeviceSettings()

    // assert
    expect(actual).toEqual({
      animation: AnimationMode.FULL,
      blePairingKey: Buffer.from('123456'),
      blePairingMode: false,
      buttonLongPressAction: [ButtonAction.CLONE_IC_UID, ButtonAction.BATTERY],
      buttonPressAction: [ButtonAction.CYCLE_SLOT_INC, ButtonAction.CYCLE_SLOT_DEC],
      version: 5,
    })
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 040a 0000 0000 f2 00')])
  })

  test('#cmdGetGitVersion()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f9 0068 0013 89 76322e302e302d3132322d6737666462333538 43'))

    // act
    const actual = await ultra.cmdGetGitVersion()

    // assert
    expect(actual).toEqual('v2.0.0-122-g7fdb358')
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f9 0000 0000 04 00')])
  })

  test('#cmdGetSupportedCmds()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 040b 0068 008c fd 03e803e903ea03eb03ec03ed03ee03ef03f003f103f203f303f403f503f603f703f803f903fa03fb03fc03fd03ff0400040104020403040404050407040604080409040a040b040c040d07d007d107d207d307d407d507d607d707d807d907da07db0bb80bb90fa00fa10fa40fa50fa60fa70fa80fa90faa0fab0fac0fad0fae0faf0fb00fb10fb213881389 f9'))

    // act
    const actual = await ultra.cmdGetSupportedCmds()

    // assert
    expect(actual).toEqual(new Set([1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1031, 1030, 1032, 1033, 1034, 1035, 1036, 1037, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 3000, 3001, 4000, 4001, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4011, 4012, 4013, 4014, 4015, 4016, 4017, 4018, 5000, 5001]))
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 040b 0000 0000 f1 00')])
  })

  test('#cmdResetSettings()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f6 0068 0000 9f 00'))

    // act
    await ultra.cmdResetSettings()

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f6 0000 0000 07 00')])
  })

  test('#cmdSaveSettings()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f5 0068 0000 a0 00'))

    // act
    await ultra.cmdSaveSettings()

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f5 0000 0000 08 00')])
  })

  test('#cmdSetAnimationMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f7 0068 0000 9e 00'))

    // act
    await ultra.cmdSetAnimationMode(AnimationMode.FULL)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f7 0000 0001 05 00 00')])
  })

  test('#cmdSetButtonLongPressAction()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0405 0068 0000 8f 00'))

    // act
    await ultra.cmdSetButtonLongPressAction(ButtonType.BUTTON_A, ButtonAction.CLONE_IC_UID)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0405 0000 0002 f5 4103 bc')])
  })

  test('#cmdSetButtonPressAction()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0403 0068 0000 91 00'))

    // act
    await ultra.cmdSetButtonPressAction(ButtonType.BUTTON_A, ButtonAction.CYCLE_SLOT_INC)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0403 0000 0002 f7 4101 be')])
  })

  test('#cmdWipeFds()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03fc 0068 0000 99 00'))

    // act
    await ultra.cmdWipeFds()

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03fc 0000 0000 01 00')])
  })

  test('#cmdSlotChangeTagType()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03ec 0068 0000 a9 00'))

    // act
    await ultra.cmdSlotChangeTagType(Slot.SLOT_1, TagType.MIFARE_1024)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03ec 0000 0003 0e 0003e9 14')])
  })

  test('#cmdSlotDeleteFreqName()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03fd 0068 0000 98 00'))

    // act
    const actual = await ultra.cmdSlotDeleteFreqName(Slot.SLOT_1, FreqType.HF)

    // assert
    expect(actual).toEqual(true)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03fd 0000 0002 fe 0002 fe')])
  })

  test('#cmdSlotDeleteFreqName()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03fd 0070 0000 90 00'))

    // act
    const actual = await ultra.cmdSlotDeleteFreqName(Slot.SLOT_1, FreqType.HF)

    // assert
    expect(actual).toEqual(false)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03fd 0000 0002 fe 0002 fe')])
  })

  test('#cmdSlotDeleteFreqType()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0400 0068 0000 94 00'))

    // act
    await ultra.cmdSlotDeleteFreqType(Slot.SLOT_1, FreqType.HF)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0400 0000 0002 fa 0002 fe')])
  })

  test('#cmdSlotGetActive()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03fa 0068 0001 9a 00 00'))

    // act
    const actual = await ultra.cmdSlotGetActive()

    // assert
    expect(actual).toEqual(Slot.SLOT_1)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03fa 0000 0000 03 00')])
  })

  test('#cmdSlotGetFreqName()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f0 0068 0005 a0 4d79546167 1e'))

    // act
    const actual = await ultra.cmdSlotGetFreqName(Slot.SLOT_1, FreqType.HF)

    // assert
    expect(actual).toEqual('MyTag')
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f0 0000 0002 0b 0002 fe')])
  })

  test('#cmdSlotGetInfo()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03fb 0068 0020 7a 03e9006403e90000000000640000000000000000000000000000000000000000 60'))

    // act
    const actual = await ultra.cmdSlotGetInfo()

    // assert
    expect(actual).toMatchObject([
      { hfTagType: TagType.MIFARE_1024, lfTagType: TagType.EM410X },
      { hfTagType: TagType.MIFARE_1024, lfTagType: TagType.UNDEFINED },
      { hfTagType: TagType.UNDEFINED, lfTagType: TagType.EM410X },
      { hfTagType: TagType.UNDEFINED, lfTagType: TagType.UNDEFINED },
      { hfTagType: TagType.UNDEFINED, lfTagType: TagType.UNDEFINED },
      { hfTagType: TagType.UNDEFINED, lfTagType: TagType.UNDEFINED },
      { hfTagType: TagType.UNDEFINED, lfTagType: TagType.UNDEFINED },
      { hfTagType: TagType.UNDEFINED, lfTagType: TagType.UNDEFINED },
    ])
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03fb 0000 0000 02 00')])
  })

  test('#cmdSlotGetIsEnable()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03ff 0068 0010 86 01010100000100000000000000000000 fc'))

    // act
    const actual = await ultra.cmdSlotGetIsEnable()

    // assert
    expect(actual).toMatchObject([
      { hf: true, lf: true },
      { hf: true, lf: false },
      { hf: false, lf: true },
      { hf: false, lf: false },
      { hf: false, lf: false },
      { hf: false, lf: false },
      { hf: false, lf: false },
      { hf: false, lf: false },
    ])
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03ff 0000 0000 fe 00')])
  })

  test('#cmdSlotResetTagType()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03ed 0068 0000 a8 00'))

    // act
    await ultra.cmdSlotResetTagType(Slot.SLOT_1, TagType.MIFARE_1024)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03ed 0000 0003 0d 0003e9 14')])
  })

  test('#cmdSlotSaveSettings()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03f1 0068 0000 a4 00'))

    // act
    await ultra.cmdSlotSaveSettings()

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03f1 0000 0000 0c 00')])
  })

  test('#cmdSlotSetActive()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03eb 0068 0000 aa 00'))

    // act
    await ultra.cmdSlotSetActive(Slot.SLOT_1)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03eb 0000 0001 11 00 00')])
  })

  test('#cmdSlotSetEnable()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03ee 0068 0000 a7 00'))

    // act
    await ultra.cmdSlotSetEnable(Slot.SLOT_1, FreqType.HF, true)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03ee 0000 0003 0c 000201 fd')])
  })

  test('#cmdSlotSetFreqName()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03ef 0068 0000 a6 00'))

    // act
    await ultra.cmdSlotSetFreqName(Slot.SLOT_1, FreqType.HF, 'My Tag')

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 03ef 0000 0008 06 00024d7920546167 fc')])
  })

  test('#cmdEm410xScan()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 0bb8 0040 0005 f8 0000002076 6a'))

    // act
    const actual = await ultra.cmdEm410xScan()

    // assert
    expect(actual).toEqual(Buffer.fromHexString('0000002076'))
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 0bb8 0000 0000 3d 00'),
    ])
  })

  test('#cmdEm410xScan() should throw tag not found error', async () => {
    expect.hasAssertions()
    try {
      // arrange
      adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
      adapter.send.push(Buffer.fromHexString('11ef 0bb8 0041 0000 fc 00'))

      // act
      const actual = await ultra.cmdEm410xScan()

      // assert
      expect(actual).toEqual(Buffer.fromHexString('0000002076'))
      expect(adapter.recv).toEqual([
        Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
        Buffer.fromHexString('11ef 0bb8 0000 0000 3d 00'),
      ])
    } catch (err) {
      expect(err.message).toMatch(/tag not found/)
    }
  })

  test('#cmdEm410xWriteToT55xx()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 0bb9 0040 0000 fc 00'))

    // act
    await ultra.cmdEm410xWriteToT55xx(Buffer.fromHexString('deadbeef88'))

    // assert
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 0bb9 0000 0011 2b deadbeef88202066665124364819920427 6b'),
    ])
  })

  test('#cmdHf14aRaw()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0000 1f 00'))

    // act
    const actual = await ultra.cmdHf14aRaw({ appendCrc: true, data: Buffer.pack('!H', 0x5000), waitResponse: false })

    // assert
    expect(actual).toEqual(Buffer.fromHexString(''))
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07da 0000 0007 18 2003e800105000 95'),
    ])
  })

  test('#cmdHf14aScan()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d0 0000 0009 20 0494194a3d04000800 bc'))

    // act
    const actual = await ultra.cmdHf14aScan()

    // assert
    expect(actual).toMatchObject([{
      atqa: Buffer.fromHexString('0400'),
      ats: Buffer.fromHexString(''),
      sak: Buffer.fromHexString('08'),
      uid: Buffer.fromHexString('94194a3d'),
    }])
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d0 0000 0000 29 00'),
    ])
  })

  test('#cmdEm410xGetEmuId()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 1389 0068 0005 f7 deadbeef88 40'))

    // act
    const actual = await ultra.cmdEm410xGetEmuId()

    // assert
    expect(actual).toMatchObject(Buffer.fromHexString('deadbeef88'))
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 1389 0000 0000 64 00')])
  })

  test('#cmdEm410xSetEmuId()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 1388 0068 0000 fd 00'))

    // act
    await ultra.cmdEm410xSetEmuId(Buffer.fromHexString('deadbeef88'))

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 1388 0000 0005 60 deadbeef88 40')])
  })

  test('#cmdHf14aGetAntiCollData()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fb2 0068 0009 ce 04deadbeef04000800 b8'))

    // act
    const actual = await ultra.cmdHf14aGetAntiCollData()

    // assert
    expect(actual).toMatchObject({
      atqa: Buffer.fromHexString('0400'),
      ats: Buffer.fromHexString(''),
      sak: Buffer.fromHexString('08'),
      uid: Buffer.fromHexString('deadbeef'),
    })
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fb2 0000 0000 3f 00')])
  })

  test('#cmdHf14aSetAntiCollData()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa1 0068 0000 e8 00'))

    // act
    await ultra.cmdHf14aSetAntiCollData({
      atqa: Buffer.from('0400', 'hex'),
      sak: Buffer.from('08', 'hex'),
      uid: Buffer.from('01020304', 'hex'),
    })

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa1 0000 0009 47 040102030404000800 e6')])
  })

  test('#cmdMf1AcquireDarkside()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d4 0000 0021 04 00d3efed0c5499e1c00000000000000000070b0d0a060e0f090000000000000000 62'))

    // act
    const actual = await ultra.cmdMf1AcquireDarkside(0, Mf1KeyType.KEY_A, true)

    // assert
    expect(actual).toMatchObject({
      ar: Buffer.fromHexString('00000000'),
      ks: Buffer.fromHexString('070b0d0a060e0f09'),
      nr: Buffer.fromHexString('00000000'),
      nt: Buffer.fromHexString('5499e1c0'),
      par: Buffer.fromHexString('0000000000000000'),
      status: DarksideStatus.OK,
      uid: Buffer.fromHexString('d3efed0c'),
    })
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d4 0000 0004 21 6000011e 81'),
    ])
  })

  test('#cmdMf1AcquireNested()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d6 0000 0012 11 502e7c41d1b90dab0561d34ecbcd6cef0207 00'))

    // act
    const actual = await ultra.cmdMf1AcquireNested(
      { block: 0, keyType: Mf1KeyType.KEY_A, key: Buffer.fromHexString('FFFFFFFFFFFF') },
      { block: 4, keyType: Mf1KeyType.KEY_A },
    )

    // assert
    expect(actual).toMatchObject([
      { nt1: Buffer.fromHexString('502e7c41'), nt2: Buffer.fromHexString('d1b90dab'), par: 5 },
      { nt1: Buffer.fromHexString('61d34ecb'), nt2: Buffer.fromHexString('cd6cef02'), par: 7 },
    ])
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d6 0000 000a 19 6000ffffffffffff6004 42'),
    ])
  })

  test('#cmdMf1AcquireStaticNested()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d3 0000 0014 12 b908a16d012001458190197501200145cdd400f3 30'))

    // act
    const actual = await ultra.cmdMf1AcquireStaticNested(
      { block: 0, keyType: Mf1KeyType.KEY_A, key: Buffer.fromHexString('FFFFFFFFFFFF') },
      { block: 4, keyType: Mf1KeyType.KEY_A },
    )

    // assert
    expect(actual).toMatchObject({
      uid: Buffer.fromHexString('b908a16d'),
      atks: [
        { nt1: Buffer.fromHexString('01200145'), nt2: Buffer.fromHexString('81901975') },
        { nt1: Buffer.fromHexString('01200145'), nt2: Buffer.fromHexString('cdd400f3') },
      ],
    })
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d3 0000 000a 1c 6000ffffffffffff6004 42'),
    ])
  })

  test('#cmdMf1CheckBlockKey()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d7 0000 0000 22 00'))

    // act
    const actual = await ultra.cmdMf1CheckBlockKey({
      block: 0,
      key: Buffer.fromHexString('FFFFFFFFFFFF'),
      keyType: Mf1KeyType.KEY_A,
    })

    // assert
    expect(actual).toEqual(true)
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d7 0000 0008 1a 6000ffffffffffff a6'),
    ])
  })

  test('#cmdMf1EmuReadBlock()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa8 0068 0010 d1 deadbeef220804000177a2cc35afa51d 0e'))

    // act
    const actual = await ultra.cmdMf1EmuReadBlock(0)

    // assert
    expect(actual).toEqual(Buffer.fromHexString('deadbeef220804000177a2cc35afa51d'))
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa8 0000 0002 47 0001 ff')])
  })

  test('#cmdMf1EmuWriteBlock()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa0 0068 0000 e9 00'))

    // act
    await ultra.cmdMf1EmuWriteBlock(1, Buffer.fromHexString('000102030405060708090a0b0c0d0e0f'))

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa0 0000 0011 40 01000102030405060708090a0b0c0d0e0f 87')])
  })

  test('#cmdMf1GetAntiCollMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fae 0068 0001 da 00 00'))

    // act
    const actual = await ultra.cmdMf1GetAntiCollMode()

    // assert
    expect(actual).toEqual(false)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fae 0000 0000 43 00')])
  })

  test('#cmdMf1GetDetectionCount()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa5 0068 0004 e0 00000003 fd'))

    // act
    const actual = await ultra.cmdMf1GetDetectionCount()

    // assert
    expect(actual).toEqual(3)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa5 0000 0000 4c 00')])
  })

  test('#cmdMf1GetDetectionEnable()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa7 0068 0001 e1 01 ff'))

    // act
    const actual = await ultra.cmdMf1GetDetectionEnable()

    // assert
    expect(actual).toEqual(true)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa7 0000 0000 4a 00')])
  })

  test('#cmdMf1GetDetectionLogs()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa6 0068 0036 ad 03fcb908a16d6bc182304954057b639985b903fcb908a16d47129bc3a78799187711be4e03fcb908a16d5ffb408aac7fd168fd7eb758 25'))

    // act
    const actual = await ultra.cmdMf1GetDetectionLogs(0)

    // assert
    expect(actual).toEqual([
      {
        block: 3,
        isKeyB: false,
        isNested: false,
        ar: Buffer.fromHexString('639985b9'),
        nr: Buffer.fromHexString('4954057b'),
        nt: Buffer.fromHexString('6bc18230'),
        uid: Buffer.fromHexString('b908a16d'),
      },
      {
        block: 3,
        isKeyB: false,
        isNested: false,
        ar: Buffer.fromHexString('7711be4e'),
        nr: Buffer.fromHexString('a7879918'),
        nt: Buffer.fromHexString('47129bc3'),
        uid: Buffer.fromHexString('b908a16d'),
      },
      {
        block: 3,
        isKeyB: false,
        isNested: false,
        ar: Buffer.fromHexString('fd7eb758'),
        nr: Buffer.fromHexString('ac7fd168'),
        nt: Buffer.fromHexString('5ffb408a'),
        uid: Buffer.fromHexString('b908a16d'),
      },
    ])
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa6 0000 0004 47 00000000 00')])
  })

  test('#cmdMf1GetEmuSettings()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa9 0068 0005 db 0100000000 ff'))

    // act
    const actual = await ultra.cmdMf1GetEmuSettings()

    // assert
    expect(actual).toMatchObject({
      antiColl: false,
      detection: true,
      gen1a: false,
      gen2: false,
      write: 0,
    })
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa9 0000 0000 48 00')])
  })

  test('#cmdMf1GetGen1aMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0faa 0068 0001 de 00 00'))

    // act
    const actual = await ultra.cmdMf1GetGen1aMode()

    // assert
    expect(actual).toEqual(false)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0faa 0000 0000 47 00')])
  })

  test('#cmdMf1GetGen2Mode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fac 0068 0001 dc 00 00'))

    // act
    const actual = await ultra.cmdMf1GetGen2Mode()

    // assert
    expect(actual).toEqual(false)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fac 0000 0000 45 00')])
  })

  test('#cmdMf1GetWriteMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fb0 0068 0001 d8 00 00'))

    // act
    const actual = await ultra.cmdMf1GetWriteMode()

    // assert
    expect(actual).toEqual(0)
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fb0 0000 0000 41 00')])
  })

  test('#cmdMf1IsSupport()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d1 0000 0000 28 00'))

    // act
    const actual = await ultra.cmdMf1IsSupport()

    // assert
    expect(actual).toEqual(true)
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d1 0000 0000 28 00'),
    ])
  })

  test('#cmdMf1ReadBlock()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d8 0000 0010 11 877209e11d0804000392abdef258ec90 10'))

    // act
    const actual = await ultra.cmdMf1ReadBlock({
      block: 0,
      key: Buffer.fromHexString('FFFFFFFFFFFF'),
      keyType: Mf1KeyType.KEY_A,
    })

    // assert
    expect(actual).toEqual(Buffer.fromHexString('877209e11d0804000392abdef258ec90'))
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d8 0000 0008 19 6000ffffffffffff a6'),
    ])
  })

  test('#cmdMf1SetAntiCollMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0faf 0068 0000 da 00'))

    // act
    await ultra.cmdMf1SetAntiCollMode(false)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0faf 0000 0001 41 00 00')])
  })

  test('#cmdMf1SetDetectionEnable()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fa4 0068 0000 e5 00'))

    // act
    await ultra.cmdMf1SetDetectionEnable(true)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fa4 0000 0001 4c 01 ff')])
  })

  test('#cmdMf1SetGen1aMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fab 0068 0000 de 00'))

    // act
    await ultra.cmdMf1SetGen1aMode(false)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fab 0000 0001 45 00 00')])
  })

  test('#cmdMf1SetGen2Mode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fad 0068 0000 dc 00'))

    // act
    await ultra.cmdMf1SetGen2Mode(false)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fad 0000 0001 43 00 00')])
  })

  test('#cmdMf1SetWriteMode()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 0fb1 0068 0000 d8 00'))

    // act
    await ultra.cmdMf1SetWriteMode(Mf1EmuWriteMode.NORMAL)

    // assert
    expect(adapter.recv).toEqual([Buffer.fromHexString('11ef 0fb1 0000 0001 3f 00 00')])
  })

  test('#cmdMf1TestNtDistance()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d5 0000 0008 1c 877209e100000080 9d'))

    // act
    const actual = await ultra.cmdMf1TestNtDistance({
      block: 0,
      key: Buffer.fromHexString('FFFFFFFFFFFF'),
      keyType: Mf1KeyType.KEY_A,
    })

    // assert
    expect(actual).toMatchObject({
      dist: Buffer.fromHexString('00000080'),
      uid: Buffer.fromHexString('877209e1'),
    })
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d5 0000 0008 1c 6000ffffffffffff a6'),
    ])
  })

  test('#cmdMf1TestPrngType()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d2 0000 0001 26 01 ff'))

    // act
    const actual = await ultra.cmdMf1TestPrngType()

    // assert
    expect(actual).toEqual(Mf1PrngType.WEAK)
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d2 0000 0000 27 00'),
    ])
  })

  test('#cmdMf1VblockManipulate()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07db 0000 0000 1e 00'))
    const key = Buffer.fromHexString('FFFFFFFFFFFF')

    // act
    await ultra.cmdMf1VblockManipulate(
      { block: 4, keyType: Mf1KeyType.KEY_A, key },
      Mf1VblockOperator.DECREMENT, 1,
      { block: 4, keyType: Mf1KeyType.KEY_A, key },
    )

    // assert
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07db 0000 0015 09 6004ffffffffffffc0000000016004ffffffffffff 83'),
    ])
  })

  test('#cmdMf1WriteBlock()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d9 0000 0000 20 00'))

    // act
    await ultra.cmdMf1WriteBlock({
      block: 4,
      keyType: Mf1KeyType.KEY_A,
      key: Buffer.fromHexString('FFFFFFFFFFFF'),
      data: Buffer.fromHexString('00000000000000000000000000000000'),
    })

    // assert
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d9 0000 0018 08 6004ffffffffffff00000000000000000000000000000000 a2'),
    ])
  })

  test('#hf14aInfo()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d0 0000 0009 20 0494194a3d04000800 bc')) // cmdHf14aScan
    adapter.send.push(Buffer.fromHexString('11ef 07d1 0000 0000 28 00')) // cmdMf1IsSupport
    adapter.send.push(Buffer.fromHexString('11ef 07d2 0000 0001 26 01 ff')) // cmdMf1TestPrngType

    // act
    const actual = await ultra.hf14aInfo()

    // assert
    expect(actual).toMatchObject([{
      antiColl: {
        atqa: Buffer.fromHexString('0400'),
        ats: Buffer.fromHexString(''),
        sak: Buffer.fromHexString('08'),
        uid: Buffer.fromHexString('94194a3d'),
      },
      nxpTypeBySak: 'MIFARE Classic 1K | Plus SE 1K | Plug S 2K | Plus X 2K',
      prngType: Mf1PrngType.WEAK,
    }])
  })

  test('#mf1VblockGetValue()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d8 0000 0010 11 01000000feffffff0100000001fe01fe 05'))

    // act
    const actual = await ultra.mf1VblockGetValue({
      block: 1,
      key: Buffer.fromHexString('FFFFFFFFFFFF'),
      keyType: Mf1KeyType.KEY_A,
    })

    // assert
    expect(actual).toMatchObject({ adr: 1, value: 1 })
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d8 0000 0008 19 6001ffffffffffff a5'),
    ])
  })

  test('#mf1VblockSetValue()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07d9 0000 0000 20 00'))

    // act
    await ultra.mf1VblockSetValue({
      block: 4,
      keyType: Mf1KeyType.KEY_A,
      key: Buffer.fromHexString('FFFFFFFFFFFF'),
    }, { adr: 1, value: 1 })

    // assert
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07d9 0000 0018 08 6004ffffffffffff01000000feffffff0100000001fe01fe a7'),
    ])
  })

  test('#mfuReadPages()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0010 0f 040dc445420d2981e7480000e1100600 c7'))

    // act
    const actual = await ultra.mfuReadPages({ pageOffset: 0 })

    // assert
    expect(actual).toEqual(Buffer.fromHexString('040dc445420d2981e7480000e1100600'))
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07da 0000 0007 18 7403e800103000 61'),
    ])
  })

  test('#mfuWritePage()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0000 1f 00'))

    // act
    await ultra.mfuWritePage({ pageOffset: 9, data: Buffer.fromHexString('00000000') })

    // assert
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07da 0000 000b 14 7403e80030a20900000000 c6'),
    ])
  })

  test('#mf1Halt()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0000 1f 00'))

    // act
    await ultra.mf1Halt()

    // assert
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07da 0000 0007 18 2003e800105000 95'),
    ])
  })

  test('#mf1Gen1aReadBlocks()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0000 1f 00'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0001 1e 0a f6'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0001 1e 0a f6'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0010 0f 877209e11d0804000392abdef258ec90 10'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0000 1f 00'))

    // act
    const actual = await ultra.mf1Gen1aReadBlocks(0, 1)

    // assert
    expect(actual).toEqual(Buffer.fromHexString('877209e11d0804000392abdef258ec90'))
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07da 0000 0007 18 2003e800105000 95'),
      Buffer.fromHexString('11ef 07da 0000 0006 19 4803e8000740 86'),
      Buffer.fromHexString('11ef 07da 0000 0006 19 4803e8000843 82'),
      Buffer.fromHexString('11ef 07da 0000 0007 18 6c03e800103000 69'),
      Buffer.fromHexString('11ef 07da 0000 0007 18 2003e800105000 95'),
    ])
  })

  test('#mf1Gen1aWriteBlocks()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0000 1f 00'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0001 1e 0a f6'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0001 1e 0a f6'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0001 1e 0a f6'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0001 1e 0a f6'))
    adapter.send.push(Buffer.fromHexString('11ef 07da 0000 0000 1f 00'))

    // act
    await ultra.mf1Gen1aWriteBlocks(1, new Buffer(16))

    // assert
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07da 0000 0007 18 2003e800105000 95'),
      Buffer.fromHexString('11ef 07da 0000 0006 19 4803e8000740 86'),
      Buffer.fromHexString('11ef 07da 0000 0006 19 4803e8000843 82'),
      Buffer.fromHexString('11ef 07da 0000 0007 18 6803e80010a001 fc'),
      Buffer.fromHexString('11ef 07da 0000 0015 0a 6803e8008000000000000000000000000000000000 2d'),
      Buffer.fromHexString('11ef 07da 0000 0007 18 2003e800105000 95'),
    ])
  })

  test('#mf1CheckSectorKeys()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07dc 0000 01ea 32 c0000000000000000000ffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 4c'))

    // act
    const keys = Buffer.from('FFFFFFFFFFFF\n000000000000\nA0A1A2A3A4A5\nD3F7D3F7D3F7', 'hex').chunk(6)
    const actual = await ultra.mf1CheckSectorKeys(0, keys)

    // assert
    expect(actual).toMatchObject({
      [Mf1KeyType.KEY_A]: Buffer.fromHexString('FFFFFFFFFFFF'),
      [Mf1KeyType.KEY_B]: Buffer.fromHexString('FFFFFFFFFFFF'),
    })
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07dc 0000 0022 fb 3fffffffffffffffffffffffffffffff000000000000a0a1a2a3a4a5d3f7d3f7d3f7 a3'),
    ])
  })

  test('#mf1ReadSectorByKeys()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07dc 0000 01ea 32 c0000000000000000000ffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 4c'))
    adapter.send.push(Buffer.fromHexString('11ef 07d8 0000 0010 11 877209e11d0804000392abdef258ec90 10'))
    adapter.send.push(Buffer.fromHexString('11ef 07d8 0000 0010 11 00000000000000000000000000000000 00'))
    adapter.send.push(Buffer.fromHexString('11ef 07d8 0000 0010 11 00000000000000000000000000000000 00'))
    adapter.send.push(Buffer.fromHexString('11ef 07d8 0000 0010 11 000000000000ff078069ffffffffffff 17'))

    // act
    const keys = Buffer.from('FFFFFFFFFFFF\n000000000000\nA0A1A2A3A4A5\nD3F7D3F7D3F7', 'hex').chunk(6)
    const actual = await ultra.mf1ReadSectorByKeys(0, keys)

    // assert
    expect(actual).toEqual({
      data: Buffer.concat([
        Buffer.fromHexString('877209e11d0804000392abdef258ec90'),
        Buffer.fromHexString('00000000000000000000000000000000'),
        Buffer.fromHexString('00000000000000000000000000000000'),
        Buffer.fromHexString('ffffffffffffff078069ffffffffffff'),
      ]),
      success: [true, true, true, true],
    })
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07dc 0000 0022 fb 3fffffffffffffffffffffffffffffff000000000000a0a1a2a3a4a5d3f7d3f7d3f7 a3'),
      Buffer.fromHexString('11ef 07d8 0000 0008 19 6100ffffffffffff a5'),
      Buffer.fromHexString('11ef 07d8 0000 0008 19 6101ffffffffffff a4'),
      Buffer.fromHexString('11ef 07d8 0000 0008 19 6102ffffffffffff a3'),
      Buffer.fromHexString('11ef 07d8 0000 0008 19 6103ffffffffffff a2'),
    ])
  })

  test('#mf1WriteSectorByKeys()', async () => {
    // arrange
    adapter.send.push(Buffer.fromHexString('11ef 03e9 0068 0000 ac 00')) // DeviceMode.READER
    adapter.send.push(Buffer.fromHexString('11ef 07dc 0000 01ea 32 30000000000000000000000000000000000000000000ffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 dc'))
    adapter.send.push(Buffer.fromHexString('11ef 07d9 0000 0000 20 00'))
    adapter.send.push(Buffer.fromHexString('11ef 07d9 0000 0000 20 00'))
    adapter.send.push(Buffer.fromHexString('11ef 07d9 0000 0000 20 00'))
    adapter.send.push(Buffer.fromHexString('11ef 07d9 0000 0000 20 00'))

    // act
    const keys = Buffer.from('FFFFFFFFFFFF\n000000000000\nA0A1A2A3A4A5\nD3F7D3F7D3F7', 'hex').chunk(6)
    const data = Buffer.concat([
      Buffer.from('00000000000000000000000000000000', 'hex'),
      Buffer.from('00000000000000000000000000000000', 'hex'),
      Buffer.from('00000000000000000000000000000000', 'hex'),
      Buffer.from('ffffffffffffff078069ffffffffffff', 'hex'),
    ])
    const actual = await ultra.mf1WriteSectorByKeys(1, keys, data)

    // assert
    expect(actual).toEqual({ success: [true, true, true, true] })
    expect(adapter.recv).toEqual([
      Buffer.fromHexString('11ef 03e9 0000 0001 13 01 ff'), // DeviceMode.READER
      Buffer.fromHexString('11ef 07dc 0000 0022 fb cfffffffffffffffffffffffffffffff000000000000a0a1a2a3a4a5d3f7d3f7d3f7 13'),
      Buffer.fromHexString('11ef 07d9 0000 0018 08 6104ffffffffffff00000000000000000000000000000000 a1'),
      Buffer.fromHexString('11ef 07d9 0000 0018 08 6105ffffffffffff00000000000000000000000000000000 a0'),
      Buffer.fromHexString('11ef 07d9 0000 0018 08 6106ffffffffffff00000000000000000000000000000000 9f'),
      Buffer.fromHexString('11ef 07d9 0000 0018 08 6107ffffffffffffffffffffffffff078069ffffffffffff bb'),
    ])
  })

  test.each([
    { acl: 'ff078069', expected: true },
    { acl: 'ffffff69', expected: false },
    { acl: '78778869', expected: true },
    { acl: 'BBF8D48E031978778869C19085AF2635', expected: true },
    { acl: '45687B3167880400C810002000000016 0E140001070208030904081000000000 00000000000000000000000000000000 BBF8D48E031978778869C19085AF2635', expected: true },
  ])('#mf1IsValidAcl($acl) = $expected', async ({ acl, expected }) => {
    // act
    const actual = ultra.mf1IsValidAcl(Buffer.fromHexString(acl))

    // assert
    expect(actual).toBe(expected)
  })
})

test('.mf1TrailerBlockNoOfSector()', async () => {
  const actual = _.times(40, ChameleonUltra.mf1TrailerBlockNoOfSector)
  expect(actual).toEqual([
    // mifare classic 1k
    3, 7, 11, 15, 19, 23, 27, 31,
    35, 39, 43, 47, 51, 55, 59, 63,
    // mifare classic 2k
    67, 71, 75, 79, 83, 87, 91, 95,
    99, 103, 107, 111, 115, 119, 123, 127,
    // mifare classic 4k
    143, 159, 175, 191, 207, 223, 239, 255,
  ])
})
