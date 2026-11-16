import type { Room } from '../types'

export const ROOMS: Room[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    capacity: 4,
    pricePerHour: 45,
    description: 'Quiet glass room with a whiteboard and dual monitors.',
    amenities: ['Whiteboard', 'Monitors', 'HDMI'],
  },
  {
    id: 'harbor',
    name: 'Harbor',
    capacity: 8,
    pricePerHour: 80,
    description: 'Team room with a long table and video bar.',
    amenities: ['Video bar', 'Speakerphone', 'TV'],
  },
  {
    id: 'lantern',
    name: 'Lantern',
    capacity: 2,
    pricePerHour: 30,
    description: 'Focus booth for deep work or 1:1 calls.',
    amenities: ['Noise dampening', 'USB-C dock'],
  },
  {
    id: 'cedar',
    name: 'Cedar',
    capacity: 12,
    pricePerHour: 120,
    description: 'Workshop space with movable walls and a projector.',
    amenities: ['Projector', 'Mic', 'Flex walls'],
  },
  {
    id: 'solstice',
    name: 'Solstice',
    capacity: 6,
    pricePerHour: 65,
    description: 'Bright corner room with standing desks.',
    amenities: ['Standing desks', 'Natural light'],
  },
  {
    id: 'atlas',
    name: 'Atlas',
    capacity: 10,
    pricePerHour: 95,
    description: 'Strategy room with a wall-size map and sticky rails.',
    amenities: ['Map wall', 'Sticky rails', 'TV'],
  },
]
