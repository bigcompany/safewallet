# Creating a secure offline wallet 

This document details how we make a 99.999% safe solution for creating offline wallets. The goal is to have a fail-proof solution to secure offline crypto-assets.

## Hardware Requirements

 - A dedicated computer
 - A dedicated USB printer
  - Paper
  - Ink
 - At least two USB memory sticks

# Preparing your hardware setup

You will need to purchase a new computer and printer in order to build this offline wallet solution. 

**Computer**

The make and model of the computer can be almost any new computer running a modern operating system. [Arch Linux](https://www.archlinux.org/) is recommended although Windows 8 or Mac OS can also be suitable. You should make sure the machine is a clean install of the operating system with no additional programs installed.

Once the computer is setup you will now take it permanently offline. Depending on the operating system, you will want to disable all external i/o devices such as: wifi, bluetooth and infrared. In most computers you can disable this directly in the BIOS or through the operating systems control panel. 

You *must* disable all of these devices at the hardware level.

If you have successfully disabling these services, your computer is now offline.

**Printer**

Almost any modern printer can be used for this setup. Multi-function devices are discouraged. A simple printer with no additional network or bluetooth functionalities would be ideal. 

A printer can be a vector of attack, so it's important to pick a simple secure printer that will only be connected to the secure computer we've set up.

It's extremely important that the printer is also a dedicated printer which is not used with any other machine.

If you ever decide to discard the printer, you must destroy the printer entirely to order to preserve any previously printed paper wallets. Many printers will store all printed materials in a buffer on the printer itself. It's possible that an attacker could recover a discarded printer and retrieve private keys.

# Installing crypto-wallet software

On a separate machine you will now download the appropriate crypto-wallet software you require.

To download bitcoin you would visit: [https://bitcoin.org/en/download](https://bitcoin.org/en/download)

**Verifying release signatures**

It's important verify the release signatures of the downloaded binaries. This will ensure you have downloaded the correct file with no modifications.

Once you have downloaded and verified your wallet installers you can copy them onto one of the USB sticks. Use this stick to transfer the installer files to the secure computer. 

You will probably also have to repeat this same process with the device drivers for the printer on the secure computer.

# Creating safe offline wallets

After installing and starting your Bitcoin client, Bitcoin should show an error that it cannot connect to the network. If the blockchain begins to download you have not properly secured the computer.

With the Bitcoin client running offline you can now generate new addresses using the Bitcoin client's GUI. From here you will want to use the `dumpprivkey` method in the Bitcoin console and then save all public / private keys which have been generated. A text file or spreadsheet is a suitable choice. 

Save this document onto the secure computer's local hard-drive and to the second ( unused ) USB stick. 

Take this document and print it out on your secure dedicated printer.

Once this process is complete you will have 3 copies of your public / private keys.

 - A dedicated USB stick
 - The local file-system of the secure computer
 - Printed on a piece of paper

It is now almost impossible for anyone to hack into your wallets unless they can physically obtain one of these items.

# Putting the offline wallets back online

To put an address back online ( to retrieve funds ) is simple. Take the public / private key pair from one of the secure copies and import it into any online wallet of your choice.

**Important**

Never bring a private key onto a non-secure computer unless you intend to immediately use it. If you need to bring one key online, you should not use the USB stick which contains the entire set of keys. You should use a different USB stick which does not contain the full set of keys. This is why this setup requires at least two USB sticks.
