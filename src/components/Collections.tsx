import React from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
import { useN04TextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/n04';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
const axios = require('axios').default;

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 343,
    margin: 'auto',
    borderRadius: 25,
    padding: 12,
  },
  media: {
    borderRadius: 25,
    height: "320px",
    width: "320px",
  },
}));

export const Collections = React.memo(function MusicCard(props) {
  const styles = useStyles();
  const mediaStyles = useFourThreeCardMediaStyles();
  const textCardContentStyles = useN04TextInfoContentStyles();
  const shadowStyles = useOverShadowStyles({ inactive: true });
  const mystyles = { 
    // "display": "flex",
    // "flexDirection": "row",
    "margin": "25px",
    // "height": "100px"
  }
  return (
    <div
     style={mystyles}
     >

    <Card className={cx(styles.root, shadowStyles.root)}>
      <CardMedia
        className={cx(styles.media, mediaStyles.root)}
        image={
            props.image
        }
      />
      <CardContent>
        <TextInfoContent
          classes={textCardContentStyles}
          overline={props.name}
          heading={props.collection}
          body={
            props.body
          }
        />
      </CardContent>
    </Card>
    </div>
  );
});
export default Collections;