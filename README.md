# Github action to create Windows Installer MSI file

This action create Windows Installer MSI files for the input exe file.

## Precondition
On Windows, Install Wix https://wixtoolset.org/

## Inputs

## Version, optional
what version to use for the built MSI, default is 0.0.1

## Outputs

The Windows installation files for the input exe file

## Example usage
      - name: Build MSI for Windows
        id: buildmsi
        uses: ./action # Uses own action
        with:
          exefile: 'hellowworld.exe'
