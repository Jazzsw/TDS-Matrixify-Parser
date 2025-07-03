# SheetForge (TDS-Matrixify-Parser) #
An advanced parser to take several sheets of different formats, in addition to user inputs 
and generate and download a single Matrixify-readable file

- Designed and Implemented by Jazz Stocker-Witterick
- The Door Store Ltd
- July 2025


# Functionality #

## Command Mode ##
This changes how the information is read by Shopify. In most cases the "Update"
option is going to be the right option for standard price updates. Information on
the other options, and their affects can be found in the Matrixify docs found here
https://matrixify.app/documentation/list-of-commands-across-matrixify-sheets/.

## Bulk Tags ##
This allows the user to add tags in bulk to all items being updated. 
Tags can be added via the input box in the top left of the sidebar, and 
can be removed using the delete button on each tag item once it gets added.

## Item Overrides ##
This allows for users to override the price updates for items based on their full 
SKU. By specifying the SKU to override and the desired price, the given item will ignore 
the new price listed in the uploaded files and will instead update based on the 
value that the user has selected.

## Format Info ##
This allows users to view default settings and specify changes to the input file
structure. This means that if the SKU or Price columns change for some reason 
the user can specify the proper columns for the program to search and process
in order to maintain functionality. Note that any changes to the standard must
be specified before each file creation. 

## File Type Specifier ##
This is the dropdown menu that appears beside the file name when the user uploads
a file. This is used by the program to specify what the file content is. 
Note that when adding custom file formats, the dropdown will not update for any
files that are already added, this means that in order to use custom formats, the 
format info must be added **FIRST** before uploading the file.
Note that the program will fail if the files are not properly specified by the user.




# File Requirements #

## B&M ##
When uploading B&M files, it should be noted that it is **Required** that a 
Shopify Export file is also uploaded along with it. This is because B&M 
files do not include the custom brass finishes that The Door Store offers.
Thus to update all B&M items on the website, a Shopify Export file 
is required to calculate the amount that is being charged for the custom
finish, for each individual item.

## Shopify Export File ##
This file alone is not used for price updates, and will not produce an output
file on its own. These files are used in conjunction with B&M files (as listed
above) to use existing Shopify data to calculate the custom finish price for 
each item and add that differential to the B&M updated price. Note that the 
sheet containing the price data must be called "Products" this is how it will
be downloaded by default as per the Matrixify standards, however renaming this 
sheet will result in the program throwing a format warning. (the program will 
still execute successfully but throw a warning about undefined SKU values)

## Reggio ##
When uploading Reggio files it is important to note that **ONLY** the "Master Sheet"
will be read. This is because the styling of the print and retail pricelist get in
the way of the data processing. This also means that the sheet with the correct data
*MUST* be named "Master Sheet". 

## Custom ##
Custom file formats may be added using the "Format Info / Requirements" tab. These 
custom formats however **MUST** use the full SKU as it appears on the Shopify site. 
Custom file uploads can not do things such as replace "-PB" with "-C3NL" or 
concatenate separate pieces of an SKU from different columns. This is because 
the algorithm must understand the format it is reading, and to provide the 
most possible file types Custom files must adhere to a basic standard.
NOTE: when adding custom column numbers for sheets remember that hidden columns DO
count towards the column number.


# Warnings and Troubleshooting #

## Warning 1 ##
### Warning Text ###
    Warning: The program identified [#] undefined SKU values identified. This is likely due to a format error. Check that your file uploads are properly specified using the dropdown, and that the file format requirement are met

### Warning Reason ###
This warning is thrown when the program finds over 10 undefined SKU values while iterating through a given sheet, 
This is most often a format issue, potently caused by a sheet with invalid format or an improper specification from 
the user. This warning can also be thrown in cases where there is no error, but the sheet contains several rows that 
have data that is not relevant (ie. title rows, blank rows, etc)

### Troubleshooting ###
* First check if you have specified the file properly (ie. the dropdown beside the filename properly corresponds with the
type of file it is)
* Check your file continence for unrelated data as mentioned above
* Check the file format requirements above or under the "Format Info / Requirements" tab in the app, and adjust the price 
and SKU columns if needed.



## Warning 2 ##
### Warning Text ###
    ERROR: It appears the file that you are trying to upload is not a .xlsx file

### Warning Reason ###
This warning is thrown when the .xlsx file reader library fails to load the file data. This is almost 
exclusively due to an improper file type.

### Troubleshooting ###
* Make sure your file is a .xslx file
* Open your file to make sure it is not corrupted in some way



## Warning 3 ##
### Warning Text ###
    Invalid input to replaceCode: { SKU, code }

### Warning Reason ###
This is mainly a debug warning and you should not encounter it. This warning is thrown when the
SKU value passed to the replacement function (what converts -PB to -C3NL) is not a valid string.
This could happen if there is an issue with the file format and the program tries to read invalid
data.

### Troubleshooting ###
* It is very unlikely to encounter this error, but troubleshoot for invalid file format as above


## Warning 4 ##
### Warning Text ###
    Warning: You are uploading a Shopify data file without a B&M file. This will have no effect. Please see README documentation on Shopify Export Files or B&M Files for more information

### Warning Reason ###
This warning is thrown when you attempt to upload a Shopify Data file without a B&M file. This will not do anything, since 
the B&M file is what holds the updated price values, and so without it the Shopify file is useless.

## Troubleshooting ## 
* Add a valid B&M file to the file list



## Warning 5 ##
### Warning Text ###
    Warning: You are uploading a B&M file without a Shopify data file. This will cause the program to fail. Please see README documentation on Shopify Export Files or B&M Files for more information

### Warning Reason ###
This warning is the same as above except reversed. Uploading a B&M file without a Shopify data file means that 
there is no data to calculate the price diff for custom finishes (since they are not from B&M). This means the 
program will fail, do to an inability to calculate prices for custom finishes.

### Troubleshooting ###
* Add a Shopify Export file from Matrixify




## Warning 6 ##
### Warning Text ###
Required headers not found. Ensure 'Variant SKU' and 'Variant Price' exist within the Shopify export file

### Warning Reason ###
This warning is thrown when attempting to read a Shopify Export file, if the row titles Variant SKU' and 'Variant Price'
are missing or changed. These row headers are part of the Matrixify Spec and are the default when downloading an export
file. However if these are changed it will cause the program to fail, as it will not know what column to search.

## Troubleshooting ##
* Fix the file format for the Shopify file if possible and try again.
* Check for case sensitivity in the column headers






