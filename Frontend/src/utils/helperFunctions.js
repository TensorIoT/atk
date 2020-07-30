import Moment from "moment";

export const getDate = (epochTime) => {
  let formated = Moment(epochTime * 1000).format(
    "dddd, MMMM Do YYYY, h:mm:ss a"
  );
  return formated;
};

export const getDaysLeft = (value) => {
  switch (value) {
    case -7:
      return "7 days ago";
    case -6.5:
      return "6½ days ago";
    case -6:
      return "6 days ago";
    case -5.5:
      return "5½ days ago";
    case -5:
      return "5 days ago";
    case -4.5:
      return "4½ days ago";
    case -4:
      return "4 days ago";
    case -3.5:
      return "3½ days ago";
    case -3:
      return "3 days ago";
    case -2.5:
      return "2½ days ago";
    case -2:
      return "2 days ago";
    case -1.5:
      return "1½ days ago";
    case -1:
      return "1 day ago";
    case -0.5:
      return "½ day ago";
    default:
      return "days ago";
  }
};

export const getDaysRight = (value) => {
  switch (value) {
    case -6.5:
      return "6½ days ago";
    case -6:
      return "6 days ago";
    case -5.5:
      return "5½ days ago";
    case -5:
      return "5 days ago";
    case -4.5:
      return "4½ days ago";
    case -4:
      return "4 days ago";
    case -3.5:
      return "3½ days ago";
    case -3:
      return "3 days ago";
    case -2.5:
      return "2½ days ago";
    case -2:
      return "2 days ago";
    case -1.5:
      return "1½ days ago";
    case -1:
      return "1 day ago";
    case -0.5:
      return "½ day ago";
    case 0:
      return "Now";
    default:
      return "days ago";
  }
};
