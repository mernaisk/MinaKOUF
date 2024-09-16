import {
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import {
  getDocumentIdByName,
  getOneDocInCollection,
} from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import { ChurchInfo, RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import { useUser } from "@/context/userContext";
import dayjs from "dayjs";
import { getChurchInfo } from "@/firebase/firebaseModelEvents";
type EventsDetailsRouteProp = RouteProp<RootStackParamList, "EventInfo">;

const EventInfo = () => {
  const route = useRoute<EventsDetailsRouteProp>();
  const { eventId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, userInfo } = useUser();
  function checkMembership() {}
  console.log(eventId);
  const { data: eventInfo, isLoading } = useQuery({
    queryFn: () => getOneDocInCollection("Events", eventId),
    queryKey: ["EventInfo", eventId],
  });

  const {
    data: OrginizationID,
    isLoading: isLoading2,
    error,
    isSuccess,
  } = useQuery<string | null>({
    queryFn: async () => {
      let OrgId: string | null = null;

      if (eventInfo?.EventInChurch === "RiksKOUF") {
        OrgId = await getDocumentIdByName(
          "Churchs",
          "Name",
          "RiksKOUF"
        );
      } else {
        OrgId = await getDocumentIdByName(
          "Churchs",
          "Name",
          eventInfo?.EventInChurch
        );
      }

      if (!OrgId) {
        throw new Error("Church information not found.");
      }

      return OrgId;
    },
    queryKey: ["Orginization", eventInfo?.EventInChurch],
  });
  if (isLoading || isLoading2) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  const Amount = eventInfo?.PriceForNonMembers;

  const renderDates = () => {
    const { StartDate, EndDate }: any = eventInfo;
    if (StartDate.justDate === EndDate.justDate) {
      return (
        <View>
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Fontisto name="date" size={24} color="black" />
              <Text style={styles.infoHeaderText}>Date</Text>
            </View>
            <Text style={styles.infoText}>{StartDate.justDate}</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Fontisto name="clock" size={24} color="black" />
              <Text style={styles.infoHeaderText}>Time</Text>
            </View>
            <Text
              style={styles.infoText}
            >{`${StartDate.justTime} - ${EndDate.justTime}`}</Text>
            <View style={styles.separator} />
          </View>
        </View>
      );
    } else {
      return (
        <>
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons
                name="calendar-start"
                size={24}
                color="black"
              />
              <Text style={styles.infoHeaderText}>Start Date</Text>
            </View>
            <Text style={styles.infoText}>{`${StartDate.dateTime}`}</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons
                name="calendar-end"
                size={24}
                color="black"
              />
              <Text style={styles.infoHeaderText}>End Date</Text>
            </View>
            <Text style={styles.infoText}>{`${EndDate.dateTime}`}</Text>
            <View style={styles.separator} />
          </View>
        </>
      );
    }
  };

  function handleBackPress() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <BackButton handleBackPress={handleBackPress}></BackButton>
        {/* {userInfo.Category.Name !== "Ungdom" && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditEvent", { eventId: eventId })
            }
            style={styles.editButton}
          >
            <FontAwesome name="edit" size={30} color="black" />
          </TouchableOpacity>
        )} */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditEvent", { eventId: eventId })
            }
            style={styles.editButton}
          >
            <FontAwesome name="edit" size={30} color="black" />
          </TouchableOpacity>
        <View>
          <Text style={styles.title}>{eventInfo?.Title}</Text>
        </View>

        <Image
          source={{ uri: eventInfo?.ImageInfo?.URL }}
          style={styles.imagePreview}
          resizeMode="cover"
        />

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <FontAwesome5 name="location-arrow" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Location</Text>
          </View>
          <Text style={styles.infoText}>{eventInfo?.Place}.</Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <FontAwesome5 name="info" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Information</Text>
          </View>
          {eventInfo?.Info ? (
            <Text style={styles.infoText}>{eventInfo?.Info}</Text>
          ) : (
            <Text style={styles.infoText}>None</Text>
          )}
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="pricetags" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Standard Price</Text>
          </View>
          <Text style={styles.infoText}>
            {eventInfo?.PriceForNonMembers} kr
          </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="pricetag" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Price for members</Text>
          </View>
          <Text style={styles.infoText}>{eventInfo?.PriceForMembers} kr</Text>
          <View style={styles.separator} />
        </View>

        {renderDates()}

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <FontAwesome name="calendar-times-o" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Deadline</Text>
          </View>
          <Text style={styles.infoText}>{eventInfo?.Deadline.dateTime} </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="church" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Church</Text>
          </View>
          {eventInfo?.EventInChurch === "RiksKOUF" ? (
            <Text style={styles.infoText}>All churchs </Text>
          ) : (
            <Text style={styles.infoText}>{eventInfo?.EventInChurch} </Text>
          )}
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <FontAwesome6 name="people-pulling" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Maximum bookings</Text>
          </View>
          <Text style={styles.infoText}>{eventInfo?.MaxAmountOfBookings} </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <FontAwesome5 name="paypal" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Swish number</Text>
          </View>
          <Text style={styles.infoText}>{eventInfo?.SwishNumber} </Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Booking", {
              BookingInfo: {
                payerID: user.uid,
                paymentDetails: {
                  type: "event",
                  eventID: eventId,
                },
                amount: Amount,
                method: {
                  type: null,
                  swishDetails: {
                    swishNumber: eventInfo?.SwishNumber,
                    confirmed: null,
                    confirmedBy: null,
                  },
                  cashDetails: {
                    receivedBy: null,
                    confirmed: null,
                    confirmedBy: null,
                  },
                },
                churchID: OrginizationID,
                date: null,
                status: "Pending",
              },
            })
          }
        >
          <Text>Book</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventInfo;

const styles = StyleSheet.create({
  infoSection: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoHeaderText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    position: "absolute",
    top: 5,
    right: 15,
    zIndex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: 350,
    height: 350,
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    minHeight: 24,
  },
  icon: {
    color: "black",
    marginHorizontal: 10,
    height: 24,
    textAlignVertical: "center",
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 24,
    height: 24,
  },
});
