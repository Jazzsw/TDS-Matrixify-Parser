# SheetForge (TDS-Matrixify-Parser)
Parser to take TDS sheets format pricelist and generate a Matrixify-readable file


## ==================== Functionality ==================== ##

# Command Mode #
This changes how the information is read by Shopify. In most cases the "Update"
option is going to be the right option for standard price updates. Information on
the other options, and their affects can be found in the Matrixify docs found here
https://matrixify.app/documentation/list-of-commands-across-matrixify-sheets/.

# Bulk Tags #
This allows the user to add tags in bulk to all the items that the price is being 
updated for. Tags can be added via the input box on the left bar of the app, and 
can be removed using the delete button on each tag item once it gets added.

# Item Overrides #
This allows for users to override the price updates for items based on their full 
SKU. By specifying the SKU to override and the desired price, that item will ignore 
the new price listed in the uploaded files and will instead update based on the 
value that the user has indicated.

# Format Info #
This allows users to view default settings and specify changes to the input file
structure. This means that if the SKU or Price columns change for some reason 
the user can specify the proper columns for the program to search and process
in order to maintain functionality. Note that any changes to the standard must
be specified before each file creation. 

# File Type Specifier #
This is the dropdown menu that appears beside the file name when the user uploads
a file. This is used by the program to specify what the file content is. 
Note that when adding custom file formats, the dropdown will not update for any
files that are already added, this means that in order to use custom formats, the 
format info must be added *FIRST* before uploading the file.
Note that the program will fail if the files are not properly specified by the user.




## ==================== File Requirements ==================== ##

# B&M #
When uploading B&M files, it should be noted that it is *Required* that a 
Shopify Export file is also uploaded along with it. This is because B&M 
files do not include the custom brass finishes that The Door Store offers.
Thus to update all B&M items on the website, a Shopify Export file 
is required to calculate the amount that is being charged for the custom
finish, for each individual item.

# Shopify Export File #
This file alone is not used for price updates, and will not produce an output
file on its own. These files are used in conjunction with B&M files (as listed
above) to use existing Shopify data to calculate the custom finish price for 
each item and add that differential to the B&M updated price.

# Reggio #
When uploading Reggio files it is important to note that *ONLY* the "Master Sheet"
will be read. This is because the styling of the print and retail pricelist get in
the way of the data processing. This also means that the sheet with the correct data
*MUST* be named "Master Sheet". 

# Custom #
Custom file formats may be added using the "Format Info / Requirements" tab. These 
custom formats however *MUST* use the full SKU as it appears on the Shopify site. 
Custom file uploads can not do things such as replace "-PB" with "-C3NL" or 
concatenate separate pieces of an SKU from different columns. This is because 
the algorithm must understand the format it is reading, and to provide the 
most possible file types Custom files must adhere to a basic standard.
NOTE: when adding custom column numbers for sheets remember that hidden columns DO
count towards the column number.
