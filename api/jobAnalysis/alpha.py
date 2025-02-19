from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import ollama
import re
import json

template = '''
You are a technical recruiter expert. Your job is to help answer the questions user ask about a specific job position or landing a job in tech in general.
Answer the question below.

Here is the covnersation history: {context}

Question: {question}

Answer:
'''

model = OllamaLLM(model="deepseek-r1")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

def handle_conversation():
    context = ""
    print("Welcome to JobHuntCompanion! My name is Alpha! I'm an AI agent, here to help you with the job hunting process! To end the conversation, simply type 'exit'. How can I help you?")
    while True:
        user_input = input("You:")
        if user_input.lower() == "exit":
            break
        result = chain.invoke({"context":context, "question": user_input})
        print("Alpha: ", result)
        context += f"\nUser: {user_input}\nAlpha: {result}"

    


def get_tech_req(job_dec:str="", verbose:bool=False):
    system_prompt = f'''
        You are a technical recruiter expert. Your job is to help answer the user questions about the provided job description.
        Here is the job_description: {job_dec}
    '''
    user_prompt = f"given the job description below, extract and list the technical requirements that the applicant must have for the provided job description."
    try:
        
        response_reason = ollama.chat(model='deepseek-r1', messages=[{'role': 'system', 'content': system_prompt} ,{'role': 'user', 'content': user_prompt}])
        reason = re.search(r'<think>(.*?)</think>',response_reason['message']['content'], re.DOTALL)
        response = re.search(r'</think>(.*)',response_reason['message']['content'], re.DOTALL)

        if reason:
            reason = reason.group(1)
        if response:
            response = response.group(1)
        if verbose:
            print(reason+'\n\n'+response)
        else:
            print("alpha responded successfully!")
        return {'reason': reason, 'response':response }
    except Exception as e:
        print(e)
        return None
# def message(data="", prompt=""):
#     response = ollama.chat(model='deepseek-r1', messages=[{'role': 'user', 'content': prompt}])
#     return jsonify({'message': response['message']['content']})

if __name__ == "__main__":
    get_tech_req("""
Amazon Prime is looking for a talented Research Scientist to help revolutionize the use of massive, online experiments to create value at scale. At Amazon Prime, understanding customer data is paramount to our success in providing customers with relevant and enticing benefits such as fast free shipping, instant videos and music, world-wide. At Amazon you will be working in one of the world's largest and most exciting big-data environments. The Research Scientist role occupies a unique space at the intersection of technology, statistics, machine-learning, econometrics, large-scale scientific computing, social science, and product management.

As a Research Scientist within Amazon Prime, you will work with our world-class business, economics, data science and engineering teams. You will propose and estimate novel statistical models to directly inform strategic decisions about characteristics of the Amazon Prime membership. These include membership prices, benefits, and benefit content, delivered to members across the world. You will solve these problems using statistics, causal inference, machine learning, and massively parallelized scientific computing. You will expand the scientific frontier of running large scale experiments. You will work closely with our software development team to automate these models at scale in distributed computing infrastructures such as Apache Spark. This position is unique in its exposure to senior members of the Prime team and other Amazon business units.

The successful candidate will be familiar with and comfortable building, estimating, and defending causal statistical models using software such as R or Python. They will have deep familiarity with the statistics of modern causal inference. They will have a desire to learn how to create world-class code and automate their work as software. Knowledge of SQL, machine learning, and large scale scientific computing using distributed computing infrastructures such as Spark-Scala or PySpark would be a plus. Additionally, the candidate will need to demonstrate the ability to communicate complicated concepts clearly to business leaders and other scientists. They should also have a desire to develop large applied business impact for customers using statistics. They create this impact by executing efficiently under highly-visible, fast-paced business deadlines. The role involves both building data products, i.e. automated and productionized statistical models at scale, as well as supporting ad-hoc strategic decisions.

Basic Qualifications

 PhD in a quantitative field, or MS degree and 1+ years of quantitative field research experience
 Experience investigating the feasibility of applying scientific principles and concepts to business problems and products
 Experience with data analysis package (R, SAS, Matlab, etc.)
 Experience using SQL databases to manage and analyze large data sets

Preferred Qualifications

 PhD in operations research, applied mathematics, theoretical computer science, or equivalent
 Experience applying forecasting and data mining techniques

Amazon is committed to a diverse and inclusive workplace. Amazon is an equal opportunity employer and does not discriminate on the basis of race, national origin, gender, gender identity, sexual orientation, protected veteran status, disability, age, or other legally protected status.

Our inclusive culture empowers Amazonians to deliver the best results for our customers. If you have a disability and need a workplace accommodation or adjustment during the application and hiring process, including support for the interview or onboarding process, please visit https://amazon.jobs/content/en/how-we-hire/accommodations for more information. If the country/region you’re applying in isn’t listed, please contact your Recruiting Partner.

Our compensation reflects the cost of labor across several US geographic markets. The base pay for this position ranges from $113,000/year in our lowest geographic market up to $195,200/year in our highest geographic market. Pay is based on a number of factors including market location and may vary depending on job-related knowledge, skills, and experience. Amazon is a total compensation company. Dependent on the position offered, equity, sign-on payments, and other forms of compensation may be provided as part of a total compensation package, in addition to a full range of medical, financial, and/or other benefits. For more information, please visit https://www.aboutamazon.com/workplace/employee-benefits. This position will remain posted until filled. Applicants should apply via our internal or external career site.""", verbose=True)


