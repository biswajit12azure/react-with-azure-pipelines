import React, { useState, useEffect } from "react";
import { TextField, Accordion, AccordionSummary, AccordionDetails, Typography, InputAdornment, CircularProgress, Fab, Popover, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from "react-redux";
import { alertActions, faqAction } from "_store";
import { useNavigate } from "react-router-dom";
import Support from "./Support";

const FAQView = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const faqData = useSelector(x => x.faq?.faqList);

  const authUserId = useSelector(x => x.auth?.userId);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(alertActions.clear());
      try {
        await dispatch(faqAction.get(authUserId)).unwrap();
      } catch (error) {
        setError(error?.message || error);
      }
    };
    fetchData();
  }, [dispatch]);

  const filteredFaq = Array.isArray(faqData) && faqData.filter(
    (faq) =>
      faq.Question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.Answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Typography className="Announcementcontainerlist ">
      <Typography variant="h4" gutterBottom className="Announcementcontent ">
        Frequently Asked Questions
      </Typography>
      <TextField
        
        variant="outlined"
        fullWidth
        className="SearchIconinput"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="SearchIcon" />
            </InputAdornment>
          ),
          'aria-label': 'search FAQs'
        }}
      />
      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <Typography className="suportcontentcontainer mar-top-16">
          {faqData && filteredFaq.length > 0 ? (
            filteredFaq.map((faq, index) => (
              <Accordion key={index} className="AccordionSummaryheadingcontent">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography className="AccordionSummaryheading" >{faq.Question}</Typography>
                </AccordionSummary>
                <AccordionDetails className="p-0">
                  <Typography className="AccordionDetailslistcontent">{faq.Answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No FAQs found for your search.
            </Typography>
          )}
        </Typography>

      )}
      <Support></Support>

    </Typography>
  );
};

export default FAQView;