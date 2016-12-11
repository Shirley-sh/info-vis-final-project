import csv
import json

csvfile = open('taxi_10000.csv', 'r')
jsonfile = open('taxi_10000.json', 'w')

reader = csv.DictReader(csvfile)
out = json.dumps([row for row in reader])
jsonfile.write(out)
jsonfile.close()
