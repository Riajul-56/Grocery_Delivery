interface ILocation {
  latitude: number;
  longitude: number;
}

interface Iprops {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}
const LiveMap = ({ userLocation, deliveryBoyLocation }: Iprops) => {
  return <div>LiveMap</div>;
};

export default LiveMap;
