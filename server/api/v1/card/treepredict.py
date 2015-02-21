import pandas as padding: 

def main():
  data = pd.read_csv('data.txt',sep=",")
  print data
  values = data.values
  print values

if __name__ == '__main__':
  main()