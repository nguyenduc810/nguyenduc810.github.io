---
title: "Keyword-driven Retrieval-Augmented Large Language Models for Cold-start User Recommendations"
collection: publications
category: conferences
permalink: /publication/2010-10-01-paper-title-number-2
excerpt: 'KALM4Rec operates in two main stages: candidates retrieval and LLM-based candidates re-ranking. In the first stage, keyword-driven retrieval models are used to identify potential candidates, addressing LLMs’ limitations in processing extensive tokens and reducing the risk of generating misleading information. '
date: 2025-01-29
venue: 'The Web Conference 2025, Workshop LLL 4 E-Commerce'
# slidesurl: 'http://academicpages.github.io/files/slides2.pdf'
paperurl: 'https://arxiv.org/pdf/2405.19612'
citation: 'Kieu, H. D., Nguyen, M. D., Nguyen, T. S., & Le, D. D. (2024). Keyword-driven retrieval-augmented large language models for cold-start user recommendations. arXiv preprint arXiv:2405.19612.'
---

Recent advancements in Large Language Models (LLMs) have shown
significant potential in enhancing recommender systems. However,
addressing the cold-start recommendation problem, where users
lack historical data, remains a considerable challenge. In this paper,
we introduce KALM4Rec (Keyword-driven Retrieval-Augmented
Large Language Models for Cold-start User Recommendations),
a novel framework specifically designed to tackle this problem by
requiring only a few input keywords from users in a practical sce-
nario of cold-start user recommendations. KALM4Rec operates in
two main stages: candidates retrieval and LLM-based candidates
re-ranking. In the first stage, keyword-driven retrieval models are
used to identify potential candidates, addressing LLMs’ limitations
in processing extensive tokens and reducing the risk of generat-
ing misleading information. In the second stage, we employ LLMs
with various prompting strategies, including zero-shot and few-
shot techniques, to re-rank these candidates by integrating multiple
examples directly into the LLM prompts. Our extensive evaluation,
using Yelp restaurant data from three English-speaking cities and
TripAdvisor hotel data, demonstrates that KALM4Rec excels in
improving recommendation quality across the two domains. The
framework’s adaptability to different domains highlights its poten-
tial for widespread applications. By integrating in-context instruc-
tions with LLMs, KALM4Rec notably enhances the performance
of cold-start recommender systems, offering a novel approach to
exploring solutions in this field. 