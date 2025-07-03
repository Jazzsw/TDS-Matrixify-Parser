# Sample Tests #

## Upload Files ##
Upload files either by dragging the files from a folder into the drop area or by 
clicking anywhere in the drop area and selecting files from your computer.

## Specifying File Types ## 
Beside each filename in the file upload section is a dropdown. This is used to 
tell the program how you want it to handle the data in a given file. For example
B&M files need the postfix changed (such as -PB to -C3NL). Improperly specifying 
files will result in the program failing due to reading invalid data.

## Adding Price Overrides ##
By adding the full SKU and desired price to the price override section located
on the left taskbar, you can override the price listed in the update file. 
This is for items that you want to keep the same price or set as a constant 
such as Keys. Given the sample data, you can try overriding using the SKU
    BM-1006-C3NL
or 
    BM-1411-C7NL
when testing the override, set the price to above 1000 to make it is visually
obvious in the resulting file which ones have been affected.

## Adding Tags ##
By using the tag section in the left taskbar above the Price Override section,
you can add tags in bulk. Tags added here will be merged with existing tags 
on the Shopify site for all the items that you are updating.

## Command Mode ##
For almost all situations, stick to "Update" for the command mode setting.
This feature can also be used for bulk deleting and bulk adding, but for 
the current purpose of the app, keep it on "Update". For more info about
the modes and what they do, you can click the question mark beside the 
command mode dropdown. 

## Format Info / Requirements ##
Since the program requires specific formats for the input files, if 
you ever need to view or edit these format requirements, it can be
done here. Note that as a safety measure, I have implemented it so that
the format requirements are refreshed each time you launch the app; this
way, if someone accidentally changes the values, the proper ones can be 
restored by simply re-opening the app. This being said, any changes you
want to make to the format must be made **each** time you use the app.

## Custom Formats ##
This allows for new file formats to be added by the user. A very 
important note about this is that since the app knows nothing 
about the file format, except for the column info you as the user
give it, it **CAN NOT** do any format-specific editing to the 
data (ie replace -PB with -C3NL) so all SKU's and prices must be
**As they appear on Shopify**. Another small thing to note with
custom formats are that you must create the format specifications 
through the "Format Info / Requirements" tab **before** you 
upload the file, or else the new format "custom_1" will not 
show up in the dropdown.
