import nltk
from wordcloud.wordcloud import WordCloud
nltk.download('stopwords')
from nltk.corpus import stopwords
import matplotlib.pyplot as plt




# def tokenize(s:str=""):
#     tokenized_s = nltk.word_tokenize(s)
#     # filtered_words = [w for w in tokenized_s if w.lower() not in stopwords.words] 
#     # for w in tokenized_s:
#     #     if w not in stopwords.words:
#     #         filtered_words.append(w)
    
    
#     print(f"{len(filtered_words)} tokens retrieved!")
#     return filtered_words


def create_word_cloud(s:str=""):
    wc = WordCloud(width=800, height=400, background_color=None, mode='RGBA', colormap='gray' )
    fig = plt.figure(num=0, figsize=(12,12))
    frequencies = wc.process_text(text=s)
    freq = []
    for k,v in frequencies.items():
        freq.append((k,v))
    freq.sort(key=lambda x: x[1], reverse=True)
    wordcloud = wc.generate_from_frequencies(frequencies= frequencies)
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    path = "./wordcloud.png"
    wc.to_file(path)
    print('word cloud generated successfully.')
    return (path, freq[:10])


if __name__ == '__main__':
    print('analysis in progress!')
#     test_s = """
# We are committed to maintaining the first-class service and high standard of excellence that have defined Morgan Stanley for over 85 years. At our foundation are five core values — putting clients first, doing the right thing, leading with exceptional ideas, committing to diversity and inclusion, and giving back — that guide our more than 80,000 employees in 1,200 offices across 42 countries. At Morgan Stanley, you’ll find trusted colleagues, committed mentors and a culture that values diverse perspectives, individual intellect and cross-collaboration. We Firm is differentiated by the caliber of our diverse team. While our company culture and commitment to inclusion define our legacy and shape our future, helping to strengthen our business and bring value to clients around the world. Learn more about how we put this commitment to action: morganstanley.com/diversity. We are proud to support our employees and their families at every point along their work-life journey, offering some of the most attractive and comprehensive employee benefits and perks in the industry.
# """

#     test_resp = create_word_cloud(test_s)
#     print(test_resp)