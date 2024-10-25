export function getDateTimeFormatOptions(format) {
    const options = {};
    const formatParts = format.replace(':', ' ').split(/[\s/.-]+/);
    for (const part of formatParts) {
        switch (part) {
            case 'dd':
                options.day = '2-digit';
                break;
            case 'd':
                options.day = 'numeric';
                break;
            case 'MM':
                options.month = '2-digit';
                break;
            case 'M':
                options.month = 'numeric';
                break;
            case 'MMM':
                options.month = 'short';
                break;
            case 'MMMM':
                options.month = 'long';
                break;
            case 'yy':
                options.year = '2-digit';
                break;
            case 'yyyy':
                options.year = 'numeric';
                break;
            case 'HH':
                options.hour = '2-digit';
                options.hour12 = false;
                break;
            case 'H':
                options.hour = 'numeric';
                options.hour12 = false;
                break;
            case 'hh':
                options.hour = '2-digit';
                options.hour12 = true;
                break;
            case 'h':
                options.hour = 'numeric';
                options.hour12 = true;
                break;
            case 'mm':
                options.minute = '2-digit';
                break;
            case 'm':
                options.minute = 'numeric';
                break;
            case 'ss':
                options.second = '2-digit';
                break;
            case 's':
                options.second = 'numeric';
                break;
            case 'a':
            case 'A':
                options.hour12 = true;
                break;
            default:
                break;
        }
    }
    return options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWRhdGUtdGltZS1mb3JtYXQtb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tbW9uL2RhdGUtaGVscGVycy9nZXQtZGF0ZS10aW1lLWZvcm1hdC1vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sVUFBVSx3QkFBd0IsQ0FDdEMsTUFBYztJQUVkLE1BQU0sT0FBTyxHQUErQixFQUFFLENBQUM7SUFFL0MsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9ELEtBQUssTUFBTSxJQUFJLElBQUksV0FBVyxFQUFFLENBQUM7UUFDL0IsUUFBUSxJQUFJLEVBQUUsQ0FBQztZQUNiLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsTUFBTTtZQUNSLEtBQUssS0FBSztnQkFDUixPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssTUFBTTtnQkFDVCxPQUFPLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztnQkFDdkIsTUFBTTtZQUNSLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDekIsTUFBTTtZQUNSLEtBQUssTUFBTTtnQkFDVCxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDekIsTUFBTTtZQUNSLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDekIsT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sT0FBTyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixNQUFNO1lBQ1IsS0FBSyxJQUFJO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2dCQUN6QixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDdEIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDekIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLE1BQU07WUFDUixLQUFLLElBQUk7Z0JBQ1AsT0FBTyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQzNCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sT0FBTyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQzNCLE1BQU07WUFDUixLQUFLLElBQUk7Z0JBQ1AsT0FBTyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQzNCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sT0FBTyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQzNCLE1BQU07WUFDUixLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRztnQkFDTixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDdEIsTUFBTTtZQUNSO2dCQUNFLE1BQU07UUFDVixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0RGF0ZVRpbWVGb3JtYXRPcHRpb25zKFxuICBmb3JtYXQ6IHN0cmluZ1xuKTogSW50bC5EYXRlVGltZUZvcm1hdE9wdGlvbnMge1xuICBjb25zdCBvcHRpb25zOiBJbnRsLkRhdGVUaW1lRm9ybWF0T3B0aW9ucyA9IHt9O1xuXG4gIGNvbnN0IGZvcm1hdFBhcnRzID0gZm9ybWF0LnJlcGxhY2UoJzonLCAnICcpLnNwbGl0KC9bXFxzLy4tXSsvKTtcbiAgZm9yIChjb25zdCBwYXJ0IG9mIGZvcm1hdFBhcnRzKSB7XG4gICAgc3dpdGNoIChwYXJ0KSB7XG4gICAgICBjYXNlICdkZCc6XG4gICAgICAgIG9wdGlvbnMuZGF5ID0gJzItZGlnaXQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2QnOlxuICAgICAgICBvcHRpb25zLmRheSA9ICdudW1lcmljJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdNTSc6XG4gICAgICAgIG9wdGlvbnMubW9udGggPSAnMi1kaWdpdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTSc6XG4gICAgICAgIG9wdGlvbnMubW9udGggPSAnbnVtZXJpYyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTU1NJzpcbiAgICAgICAgb3B0aW9ucy5tb250aCA9ICdzaG9ydCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTU1NTSc6XG4gICAgICAgIG9wdGlvbnMubW9udGggPSAnbG9uZyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAneXknOlxuICAgICAgICBvcHRpb25zLnllYXIgPSAnMi1kaWdpdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAneXl5eSc6XG4gICAgICAgIG9wdGlvbnMueWVhciA9ICdudW1lcmljJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdISCc6XG4gICAgICAgIG9wdGlvbnMuaG91ciA9ICcyLWRpZ2l0JztcbiAgICAgICAgb3B0aW9ucy5ob3VyMTIgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdIJzpcbiAgICAgICAgb3B0aW9ucy5ob3VyID0gJ251bWVyaWMnO1xuICAgICAgICBvcHRpb25zLmhvdXIxMiA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2hoJzpcbiAgICAgICAgb3B0aW9ucy5ob3VyID0gJzItZGlnaXQnO1xuICAgICAgICBvcHRpb25zLmhvdXIxMiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaCc6XG4gICAgICAgIG9wdGlvbnMuaG91ciA9ICdudW1lcmljJztcbiAgICAgICAgb3B0aW9ucy5ob3VyMTIgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21tJzpcbiAgICAgICAgb3B0aW9ucy5taW51dGUgPSAnMi1kaWdpdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIG9wdGlvbnMubWludXRlID0gJ251bWVyaWMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NzJzpcbiAgICAgICAgb3B0aW9ucy5zZWNvbmQgPSAnMi1kaWdpdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncyc6XG4gICAgICAgIG9wdGlvbnMuc2Vjb25kID0gJ251bWVyaWMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2EnOlxuICAgICAgY2FzZSAnQSc6XG4gICAgICAgIG9wdGlvbnMuaG91cjEyID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3B0aW9ucztcbn1cbiJdfQ==