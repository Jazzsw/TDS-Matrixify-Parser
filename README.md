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
a file. This is used by the program to specify what the file content is. Note 
that the program will fail if the files are not properly specified by the user.




## ==================== File Requirements ==================== ##

# B&M #
When uploading B&M files, it should be noted that it is *Required* that a 
Shopify Export file is also uploaded along with it. This is because B&M 
files do not include the custom brass finishes that The Door Store offers.
Thus to update all B&M items on the website, a Shopify Export file 
is required to calculate the amount that is being charged for the custom
finish, for each individual item.


# Reggio #
When uploading Reggio files it is important to note that *ONLY* the "Master Sheet"
will be read. This is because the styling of the print and retail pricelist get in
the way of the data processing. This also means that the sheet with the correct data
*MUST* be named "Master Sheet". 
