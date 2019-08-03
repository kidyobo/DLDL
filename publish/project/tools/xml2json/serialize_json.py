# -*- coding: utf-8 -*-
# encoding: utf-8

import os, getopt, sys, json, msgpack

# ��ȡ�ű�����
opts, args = getopt.getopt(sys.argv[1:], "hi:o:")
input_file = ""
output_file = ""

for op, value in opts:
  if op == "-i":
    input_file = value
  elif op == "-o":
    output_file = value
  elif op == "-h":
    print("Example: >>>python serialize_json.py -i SkillConfig_Flash.json -o SkillConfig_Flash.bin")
    sys.exit()
    
print("reading file: %s ..." % (input_file))

# �������ļ�
file_object = open(input_file, 'r', encoding='utf-8')
try:
  input_content = file_object.read()
finally:
  file_object.close()

print("packing...")

packed = msgpack.packb(json.loads(input_content))

print("finish packing, byte length = %d" % (len(packed)))


# д��������ļ�
print("writing file: %s ..." % (output_file))
file_object = open(output_file, 'wb')
file_object.write(packed)  
file_object.close()