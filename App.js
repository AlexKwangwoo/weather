import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "ea6d17f60a16692813a23e5574304a16";

export default class extends React.Component {
  state = {
    isLoading: true,
  };
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather,
      },
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    ); //변수를 문자열에 포함시키기 위해선 `` 를 써야한다!
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp,
    });
  };
  getLocation = async () => {
    try {
      // throw Error();
      await Location.requestPermissionsAsync();
      // permission을 가지고 location을 얻었음!
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      // Send to api and get the weather
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Cant find you,", "So sad");
    }
  };

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading></Loading>
    ) : (
      <Weather temp={Math.round(temp)} condition={condition}></Weather>
    );
  }
}
