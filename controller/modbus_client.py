#!/usr/bin/env python3
"""Pymodbus asynchronous client example.

An example of a single threaded synchronous client.

usage: simple_client_async.py

All options must be adapted in the code
The corresponding server must be started before e.g. as:
    python3 server_sync.py
"""
import asyncio

import pymodbus.client as ModbusClient_
from pymodbus import (
    ExceptionResponse,
    Framer,
    ModbusException,
    pymodbus_apply_logging_config,
)

import struct
from IPython.display import clear_output

class ModbusClient:
    def __init__(self, comm='tcp', framer=Framer.SOCKET, host="localhost", port=502):
        self.host = host
        self.port = port
        self.comm = comm
        self.framer = framer

        self.x1 = 0;
        self.qe = 0;
        self.qc = 0;
        self.x2 = 0;
        self.qs = 0;
        self.ref1 = 0;
        self.ref2 = 0;
        self.vc = 0;
        self.vs = 0;        
    
        self.client = self.build_client();

    def buffer_to_float(self, data, offset):
        float_value = struct.unpack('>f', struct.pack('>HH', *data[offset:offset+2]))[0]
        return round(float_value, 3)
    
    def float_to_buffer(self, value):
        buf = struct.unpack('>HH', struct.pack('>f', value))
        return buf

    def build_client(self):

        # activate debugging
        #pymodbus_apply_logging_config("DEBUG")

        print("get client")
        if self.comm == "tcp":
            client = ModbusClient_.ModbusTcpClient(
                self.host,
                port=self.port,
                framer=self.framer,
                # timeout=10,
                # retries=3,
                # retry_on_empty=False,
                # source_address=("localhost", 0),
            )
        elif self.comm == "udp":
            client = ModbusClient_.ModbusUdpClient(
                self.host,
                port=self.port,
                framer=self.framer,
                # timeout=10,
                # retries=3,
                # retry_on_empty=False,
                # source_address=None,
            )
        elif self.comm == "serial":
            client = ModbusClient_.ModbusSerialClient(
                self.port,
                framer=self.framer,
                # timeout=10,
                # retries=3,
                # retry_on_empty=False,
                # strict=True,
                baudrate=9600,
                bytesize=8,
                parity="N",
                stopbits=1,
                # handle_local_echo=False,
            )
        elif self.comm == "tls":
            client = ModbusClient_.ModbusTlsClient(
                self.host,
                port=self.port,
                framer=self.framer.TLS,
                # timeout=10,
                # retries=3,
                # retry_on_empty=False,
                # sslctx=sslctx,
                certfile="../examples/certificates/pymodbus.crt",
                keyfile="../examples/certificates/pymodbus.key",
                # password="none",
                server_hostname="localhost",
            )
        else:
            print(f"Unknown client {self.comm} selected")
        
        return  client;
    
    def write_registers(self, address, value):        
        #print("set and verify data")
        try:
            #print(f"Modbus buffer write: ({self.float_to_buffer(value)})")            
            # See all calls in client_calls.py
            #print(self.float_to_buffer(value))
            rr = self.client.write_registers(address, self.float_to_buffer(value), slave=1)
        except ModbusException as exc:
            print(f"Received ModbusException({exc}) from library")
            self.client.close()
            return
        if rr.isError():
            print(f"Received Modbus library error({rr})")
            self.client.close()
            return
        if isinstance(rr, ExceptionResponse):
            print(f"Received Modbus library exception ({rr})")
            # THIS IS NOT A PYTHON EXCEPTION, but a valid modbus message
            self.client.close()

    def write_data(self):
        self.client.connect()
        # test client is connected
        assert self.client.connected
        
        self.write_registers(4, self.qe)
        self.write_registers(12, self.vc)        
        
        self.client.close()

    def read_data(self):

        #print("connect to server")
        self.client.connect()
        # test client is connected
        assert self.client.connected

        #print("get and verify data")
        try:
            # See all calls in client_calls.py
            rr = self.client.read_holding_registers(0, 37, slave=1)
        except ModbusException as exc:
            print(f"Received ModbusException({exc}) from library")
            self.client.close()
            return
        if rr.isError():
            print(f"Received Modbus library error({rr})")
            self.client.close()
            return
        if isinstance(rr, ExceptionResponse):
            print(f"Received Modbus library exception ({rr})")
            # THIS IS NOT A PYTHON EXCEPTION, but a valid modbus message
            self.client.close()

        #print(f"Received Modbus: ({rr.registers})")
        #print(f"x1: ({buffer_to_float(rr.registers, 0)})")

        #x1 = 0;

        # from pymodbus.payload import BinaryPayloadDecoder
        # from pymodbus.constants import Endian
        # decoder = BinaryPayloadDecoder.fromRegisters(rr.registers, Endian.BIG, wordorder=Endian.LITTLE)
        # x1 = str(decoder.decode_32bit_float())
        

        # buf = bytearray(4)
        # for num in rr.registers:
        #     print(num)
        #     buf.extend(struct.pack('>H', num))
        #     print(buf)
        
        # print(buf)
        # buf = bytearray(b'\x00\x00\x40\x40') 
        # x1 = struct.unpack('>f', buf)[0]

        #1 = struct.unpack('>f', struct.pack('>HH', *rr.registers[:2]))[0]

        #x1 = round(x1, 3)
        self.x1 = self.buffer_to_float(rr.registers, 0)
        self.qe = self.buffer_to_float(rr.registers, 4);
        self.qc = self.buffer_to_float(rr.registers, 8);
        self.vc = self.buffer_to_float(rr.registers, 12);        
        self.x2 = self.buffer_to_float(rr.registers, 16);
        self.qs = self.buffer_to_float(rr.registers, 20);
        self.vs = self.buffer_to_float(rr.registers, 24);        
        self.ref1 = self.buffer_to_float(rr.registers, 28);
        self.ref2 = self.buffer_to_float(rr.registers, 32);
        self.controltype = rr.registers[36]

        # clear_output(wait=True)
        # print(f"x1: {self.x1}")
        # print(f"qe: {self.qe}")
        # print(f"qc: {self.qc}")
        # print(f"vc: {self.vc}")
        # print(f"x2: {self.x2}")
        # print(f"qs: {self.qs}")
        # print(f"vs: {self.vs}")
        # print(f"ref1: {self.ref1}")
        # print(f"ref2: {self.ref2}")


        #x = struct.unpack('>HH', struct.pack('>f', 123.456789))   
        #x = struct.pack('>f', 123.456789)
        #print(x)

        #float_value = struct.unpack('>f', struct.pack('>HH', *rr.registers[:2]))[0]
        #print(float_value)

        #print("close connection")
        self.client.close()


# async def read_modbus():
#     while True:
#         await run_async_simple_client("tcp", "192.168.68.150", 502)#, debug=False
#         await asyncio.sleep(0.5)  # Espera 0.5 segundos

# if __name__ == "__main__":        
#         asyncio.run(read_modbus())