package com.example.websocketdemo;

import jssc.SerialPortList;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.usb.*;
import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class WebsocketDemoApplicationTests {

	@Test
	public void contextLoads() throws UsbException {
		UsbServices services = UsbHostManager.getUsbServices( );
		UsbHub	 root = services.getRootUsbHub( );
		listDevices(root);
	}
	public static void listDevices(UsbHub hub) {
		List devices = hub.getAttachedUsbDevices( );
		Iterator iterator = devices.iterator( );
		while (iterator.hasNext( )) {
			UsbDevice device = (UsbDevice) iterator.next( );
			System.out.println(device);
			if (device.isUsbHub( )) {
				listDevices((UsbHub) device);
			}
		}
	}

}
