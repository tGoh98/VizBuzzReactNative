import React, { useState } from "react";
import { Audio } from "expo-av";
import {
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  View,
  Button,
  TouchableHighlight,
  Image
} from "react-native";
import { buttonColors, primaryColors } from "../../constants/colors";
import { WordContainer } from "../../types/types";
import {
  setTranscriptIndex,
  showTranscript
} from "../../actions/pageSetupActions";
import { connect } from "react-redux";
import TranscriptHeader from "./transcriptComp/TranscriptHeader";
import Player from "./transcriptComp/Player";
import { showFaveTranscript } from "../../actions/userFavoritePodcastActions";
import {
  setWordDisplay,
  addWordDisplay,
  setComputeWordDisplay
} from "../../actions/podcastActions";

export type Props = {
  transcript: Array<WordContainer>;
  showTranscript: (show: boolean) => void;
  isTranscript: boolean;
  rss_url: string;
  image_url: string;
  streaming_url: string;
  authors: string;
  faveShowing: boolean;
  wordDisplay: Array<any>;
  setWordDisplay: (words: Array<any>) => void;
  addWordDisplay: (word: any) => void;
  shouldComputeWordDisplay: boolean;
};

const PodcastTranscript = (props: Props) => {
  //console.log("PODCAST: ", props.transcript);
  let words = [];
  words = generateTranscript(props.transcript, props.addWordDisplay);
  return (
    <Modal
      visible={props.isTranscript || props.faveShowing}
      animationType="slide"
      style={styles.modalContainer}
    >
      <View style={styles.headerContainer}>
        <TranscriptHeader />
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView>
          <View style={styles.textTogether}>{words}</View>
        </ScrollView>
      </View>
      <View style={styles.playerContainer}>
        <Player />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    height: "18%",
    width: "100%",
    backgroundColor: primaryColors.background
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  scrollContainer: {
    width: "100%",
    height: "72%",
    paddingTop: 5,
    paddingHorizontal: 30
  },
  playerContainer: {
    width: "100%",
    height: "10%",
    backgroundColor: primaryColors.background
  },
  textArea: {
    fontSize: 25,
    textAlign: "center"
  },
  textTogether: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  timeStamp: {
    width: "100%"
  },
  touchable: {
    backgroundColor: buttonColors.closeButton,
    padding: 10,
    width: "100%"
  },
  tinyLogo: {
    width: 50,
    height: 50
  }
});

const generateTranscript = (
  transcript: Array<WordContainer>,
  addWord: (w: any) => void
) => {
  let allComp = [];
  let wordComp;
  for (let i = 0; i < transcript.length; i++) {
    let word = transcript[i];
    if (i !== 0 && i % 21 === 0) {
      wordComp = (
        <View key={"word" + i} style={styles.timeStamp}>
          <Text
            style={{
              ...styles.textArea,
              color: word.color,
              fontSize: word.size,
              fontStyle: word.weight
            }}
          >
            {word.word}
          </Text>
        </View>
      );
    } else {
      wordComp = (
        <Text
          key={"word" + i}
          style={{
            ...styles.textArea,
            color: word.color,
            fontSize: word.size,
            fontStyle: word.weight
          }}
        >
          {word.word}
        </Text>
      );
    }
    //addWord(wordComp);
    allComp.push(wordComp);
  }
  return allComp;
};

const mapStateToProps = (state: any) => {
  return {
    transcript: state.podcast.podcast,
    isTranscript: state.pageSetup.isShowingTranscript,
    rss_url: state.podcast.rss_url,
    image_url: state.podcast.image_url,
    streaming_url: state.podcast.streaming_url,
    authors: state.podcast.authors,
    faveShowing: state.favePodcasts.isShowingTranscript,
    wordDisplay: state.podcast.wordDisplay,
    shouldComputeWordDisplay: state.podcast.shouldComputeWordDisplay
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    showTranscript: (show: boolean) => dispatch(showTranscript(show)),
    showFaveTranscript: (show: boolean) => dispatch(showFaveTranscript(show)),
    setWordDisplay: (words: Array<any>) => dispatch(setWordDisplay(words)),
    addWordDisplay: (word: any) => dispatch(addWordDisplay(word)),
    setComputeWordDisplay: (should: boolean) =>
      dispatch(setComputeWordDisplay(should))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastTranscript);
