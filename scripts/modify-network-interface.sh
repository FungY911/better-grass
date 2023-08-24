#!/bin/bash

read -p "Name of the base interface of the network: " base_interface
read -p "Broadcast address: " broadcast_address

# Get the amount of ip addresses available
ip_addresses=$(ip address show dev "$base_interface" | grep inet | awk '{print $2}')

# Start looping through each ip address
index=0
for ip_address in $ip_addresses
do
  # Skip first interface, most likely it's the base ip
  if [[ $index -gt 0 ]]
  then
    interface="$base_interface:$index"

    # Delete the old interface with base interface name
    ip address del "$ip_address" dev "$base_interface"

    # Add new interface with broadcast and sub interface
    ip address add "$ip_address" broadcast "$broadcast_address" dev "$base_interface" label "$interface"

    # Bring up the new interface
    ip link set "$interface" up
  fi

  ((index++))
done

